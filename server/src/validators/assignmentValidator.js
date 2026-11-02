import { z } from 'zod';

export const createAssignmentSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    instructions: z.string().min(10, 'Instructions must be at least 10 characters'),
    totalMarks: z.coerce.number().min(1).default(100),
    passingMarks: z.coerce.number().min(1).default(50),
    deadline: z.string().optional(),
    section: z.string().optional(),
    referenceFiles: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          size: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  }),
});

export const submitAssignmentSchema = z.object({
  body: z.object({
    studentNotes: z.string().optional().default(''),
    submissionFiles: z
      .array(
        z.object({
          name: z.string(),
          url: z.string(),
          size: z.string().optional(),
        })
      )
      .min(1, 'Please upload at least one submission file'),
  }),
});

export const gradeAssignmentSchema = z.object({
  body: z.object({
    marksAwarded: z.coerce.number().min(0, 'Marks cannot be negative'),
    feedback: z.string().optional().default(''),
    status: z.enum(['graded', 'resubmission-required']).default('graded'),
  }),
});
