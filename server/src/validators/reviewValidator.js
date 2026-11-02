import { z } from 'zod';

export const createReviewSchema = z.object({
  body: z.object({
    rating: z.coerce.number().min(1, 'Rating must be between 1 and 5').max(5),
    comment: z.string().min(5, 'Review must be at least 5 characters').max(1000),
  }),
});
