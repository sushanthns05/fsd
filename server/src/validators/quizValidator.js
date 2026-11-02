import { z } from 'zod';

export const createQuizSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Quiz title must be at least 3 characters'),
    description: z.string().optional(),
    durationMinutes: z.coerce.number().min(0).default(15),
    passingPercentage: z.coerce.number().min(1).max(100).default(70),
    maxAttempts: z.coerce.number().min(0).default(3),
    section: z.string().optional(),
    lesson: z.string().optional(),
  }),
});

export const createQuestionSchema = z.object({
  body: z.object({
    questionText: z.string().min(5, 'Question text must be at least 5 characters'),
    questionType: z.enum(['single-choice', 'multiple-choice']).default('single-choice'),
    options: z
      .array(
        z.object({
          text: z.string().min(1, 'Option text is required'),
          isCorrect: z.boolean(),
        })
      )
      .min(2, 'At least 2 options are required'),
    explanation: z.string().optional(),
    marks: z.coerce.number().min(1).default(10),
  }),
});

export const submitQuizSchema = z.object({
  body: z.object({
    answers: z.array(
      z.object({
        questionId: z.string().min(1, 'Question ID is required'),
        selectedOptions: z.array(z.number()),
      })
    ),
    timeSpentSeconds: z.coerce.number().min(0).default(0),
  }),
});
