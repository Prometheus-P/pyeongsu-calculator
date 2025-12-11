import { z, defineCollection } from 'astro:content';

/**
 * FAQ item schema for FAQPage structured data
 */
const faqItemSchema = z.object({
  question: z.string().refine((q) => q.endsWith('?'), {
    message: 'Question must end with ?',
  }),
  answer: z.string().min(30, 'Answer must be at least 30 characters'),
});

/**
 * HowTo step schema for HowTo structured data
 */
const howToStepSchema = z.object({
  name: z.string().min(1, 'Step name is required'),
  text: z.string().min(1, 'Step text is required'),
});

/**
 * Guides collection schema
 * Used for Content Collections with Zod validation
 */
const guidesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    // Required fields
    title: z.string().max(70, 'Title must be at most 70 characters for SEO'),
    description: z
      .string()
      .min(100, 'Description must be at least 100 characters')
      .max(160, 'Description must be at most 160 characters for SEO'),
    publishDate: z.coerce.date(),
    canonical: z.string().url('Canonical must be a valid URL'),
    keywords: z
      .array(z.string())
      .min(3, 'At least 3 keywords required')
      .max(7, 'At most 7 keywords allowed'),
    category: z.string().min(1, 'Category is required'),

    // Optional fields
    updatedDate: z.coerce.date().optional(),
    ogImage: z.string().optional(),

    // Schema.org structured data (optional)
    faqs: z.array(faqItemSchema).optional(),
    howToSteps: z.array(howToStepSchema).min(2, 'HowTo requires at least 2 steps').optional(),
  }),
});

export const collections = {
  guides: guidesCollection,
};
