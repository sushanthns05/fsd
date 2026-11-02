import { Quiz, Question, QuizAttempt, Course, Notification } from '../models/index.js';

export const getQuizzesForCourse = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const quizzes = await Quiz.find({ course: courseId, isActive: true })
      .select('title description durationMinutes passingPercentage totalMarks questionsCount maxAttempts')
      .sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (err) {
    next(err);
  }
};

export const getQuizById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id).populate('course', 'title instructor');

    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    const isInstructorOrAdmin =
      req.user.role === 'admin' ||
      (quiz.course?.instructor &&
        quiz.course.instructor.toString() === req.user._id.toString());

    // Fetch questions
    let questions;
    if (isInstructorOrAdmin) {
      // Instructors see correct answers and explanations
      questions = await Question.find({ quiz: id }).sort({ orderIndex: 1 });
    } else {
      // SECURITY: Sanitize questions for student - never leak isCorrect or explanation before submission
      const rawQuestions = await Question.find({ quiz: id }).sort({ orderIndex: 1 });
      questions = rawQuestions.map((q) => ({
        _id: q._id,
        quiz: q.quiz,
        questionText: q.questionText,
        questionType: q.questionType,
        marks: q.marks,
        options: q.options.map((opt, idx) => ({
          index: idx,
          text: opt.text,
        })),
      }));
    }

    // Check user's attempt count
    const attemptCount = await QuizAttempt.countDocuments({
      quiz: id,
      student: req.user._id,
    });

    res.status(200).json({
      success: true,
      quiz: {
        _id: quiz._id,
        title: quiz.title,
        description: quiz.description,
        durationMinutes: quiz.durationMinutes,
        passingPercentage: quiz.passingPercentage,
        totalMarks: quiz.totalMarks,
        maxAttempts: quiz.maxAttempts,
        questionsCount: questions.length,
      },
      questions,
      attemptCount,
      canAttempt: quiz.maxAttempts === 0 || attemptCount < quiz.maxAttempts,
    });
  } catch (err) {
    next(err);
  }
};

export const submitQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { answers = [], timeSpentSeconds = 0 } = req.body;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    // Check attempt limits
    const priorAttempts = await QuizAttempt.countDocuments({
      quiz: id,
      student: req.user._id,
    });

    if (quiz.maxAttempts > 0 && priorAttempts >= quiz.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `Maximum allowed attempts (${quiz.maxAttempts}) reached for this quiz.`,
      });
    }

    // Fetch official questions from database
    const questions = await Question.find({ quiz: id });
    if (questions.length === 0) {
      return res.status(400).json({ success: false, message: 'Quiz contains no questions.' });
    }

    let totalMarks = 0;
    let scoreAchieved = 0;
    const evaluatedAnswers = [];

    // Map answers by questionId for fast lookup
    const studentAnswerMap = {};
    answers.forEach((ans) => {
      studentAnswerMap[ans.questionId] = ans.selectedOptions || [];
    });

    for (const q of questions) {
      const qMarks = q.marks || 10;
      totalMarks += qMarks;

      const selected = studentAnswerMap[q._id.toString()] || [];
      const correctIndices = [];
      q.options.forEach((opt, idx) => {
        if (opt.isCorrect) correctIndices.push(idx);
      });

      // Compare selections
      const isCorrect =
        selected.length === correctIndices.length &&
        selected.every((val) => correctIndices.includes(val));

      const marksAwarded = isCorrect ? qMarks : 0;
      scoreAchieved += marksAwarded;

      evaluatedAnswers.push({
        question: q._id,
        selectedOptions: selected,
        isCorrect,
        marksAwarded,
      });
    }

    const percentage = totalMarks > 0 ? Math.round((scoreAchieved / totalMarks) * 100) : 0;
    const isPassed = percentage >= quiz.passingPercentage;

    const attempt = await QuizAttempt.create({
      quiz: id,
      student: req.user._id,
      course: quiz.course,
      answers: evaluatedAnswers,
      scoreAchieved,
      totalMarks,
      percentage,
      isPassed,
      timeSpentSeconds,
      attemptNumber: priorAttempts + 1,
    });

    // Send in-app notification
    await Notification.create({
      recipient: req.user._id,
      title: isPassed ? 'Quiz Passed! 🎯' : 'Quiz Result Available',
      message: `You scored ${percentage}% on "${quiz.title}" (${isPassed ? 'Passed' : 'Needs improvement'}).`,
      type: 'quiz',
      linkUrl: `/student/quiz/${id}/results`,
    });

    res.status(200).json({
      success: true,
      message: 'Quiz submitted and evaluated successfully!',
      result: {
        attemptId: attempt._id,
        scoreAchieved,
        totalMarks,
        percentage,
        isPassed,
        passingPercentage: quiz.passingPercentage,
        attemptNumber: attempt.attemptNumber,
        remainingAttempts:
          quiz.maxAttempts > 0 ? Math.max(0, quiz.maxAttempts - attempt.attemptNumber) : 'Unlimited',
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getQuizAttempts = async (req, res, next) => {
  try {
    const { id } = req.params;
    const attempts = await QuizAttempt.find({ quiz: id, student: req.user._id }).sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      attempts,
    });
  } catch (err) {
    next(err);
  }
};

export const createQuiz = async (req, res, next) => {
  try {
    const { courseId } = req.params;
    const { title, description, durationMinutes, passingPercentage, maxAttempts, section, lesson } =
      req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found.' });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const quiz = await Quiz.create({
      course: courseId,
      section: section || undefined,
      lesson: lesson || undefined,
      title,
      description: description || '',
      durationMinutes: durationMinutes !== undefined ? durationMinutes : 15,
      passingPercentage: passingPercentage || 70,
      maxAttempts: maxAttempts !== undefined ? maxAttempts : 3,
    });

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully.',
      quiz,
    });
  } catch (err) {
    next(err);
  }
};

export const addQuestion = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { questionText, questionType, options, explanation, marks } = req.body;

    const quiz = await Quiz.findById(id).populate('course');
    if (!quiz) {
      return res.status(404).json({ success: false, message: 'Quiz not found.' });
    }

    if (
      quiz.course.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized.' });
    }

    const count = await Question.countDocuments({ quiz: id });
    const question = await Question.create({
      quiz: id,
      questionText,
      questionType: questionType || 'single-choice',
      options,
      explanation: explanation || '',
      marks: marks || 10,
      orderIndex: count,
    });

    // Update quiz question count and total marks
    const allQuestions = await Question.find({ quiz: id });
    const totalMarks = allQuestions.reduce((acc, q) => acc + (q.marks || 10), 0);
    await Quiz.findByIdAndUpdate(id, {
      questionsCount: allQuestions.length,
      totalMarks,
    });

    res.status(201).json({
      success: true,
      message: 'Question added to quiz successfully.',
      question,
    });
  } catch (err) {
    next(err);
  }
};
