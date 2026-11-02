import { z } from 'zod';

export const createCourseSchema = z.object({
  body: z.object({
    title: z.string().min(5, 'Title must be at least 5 characters').max(120),
    subtitle: z.string().max(200).optional(),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    category: z.string().min(1, 'Category is required'),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).default('all-levels'),
    language: z.string().default('English'),
    price: z.coerce.number().min(0, 'Price must be 0 or positive').default(0),
    isFree: z.boolean().optional().default(false),
    thumbnail: z.string().optional(),
    trailerVideoUrl: z.string().optional(),
    objectives: z.array(z.string()).optional().default([]),
    requirements: z.array(z.string()).optional().default([]),
    targetAudience: z.array(z.string()).optional().default([]),
  }),
});

export const updateCourseSchema = z.object({
  body: z.object({
    title: z.string().min(5).max(120).optional(),
    subtitle: z.string().max(200).optional(),
    description: z.string().min(20).optional(),
    category: z.string().optional(),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced', 'all-levels']).optional(),
    language: z.string().optional(),
    price: z.coerce.number().min(0).optional(),
    isFree: z.boolean().optional(),
    thumbnail: z.string().optional(),
    trailerVideoUrl: z.string().optional(),
    objectives: z.array(z.string()).optional(),
    requirements: z.array(z.string()).optional(),
    targetAudience: z.array(z.string()).optional(),
  }),
});

export const sectionSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Section title must be at least 3 characters'),
    description: z.string().optional(),
    orderIndex: z.coerce.number().optional().default(0),
  }),
});

export const lessonSchema = z.object({
  body: z.object({
    title: z.string().min(3, 'Lesson title must be at least 3 characters'),
    description: z.string().optional(),
    type: z.enum(['video', 'article', 'pdf']).default('video'),
    videoUrl: z.string().optional().default(''),
    videoDurationSeconds: z.coerce.number().optional().default(0),
    contentBody: z.string().optional().default(''),
    isPreviewAllowed: z.boolean().optional().default(false),
    orderIndex: z.coerce.number().optional().default(0),
    resources: z
      .array(
        z.object({
          title: z.string(),
          fileUrl: z.string(),
          fileType: z.string().optional(),
          fileSize: z.string().optional(),
        })
      )
      .optional()
      .default([]),
  }),
});
