import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const articles = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articles' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    excerpt: z.string(),
    cover: image().optional(),
    author: z.string().default('ಕದಳಿ ಸಮಾಜ'),
    category: z.string().default('ಸಮುದಾಯ'),
    pubDate: z.coerce.date(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const events = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/events' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    shortDescription: z.string(),
    poster: image().optional(),
    start: z.coerce.date(),
    end: z.coerce.date().optional(),
    venue: z.string().default(''),
    mapUrl: z.string().url().optional(),
    contact: z.string().default(''),
    cancelled: z.boolean().default(false),
    featured: z.boolean().default(false),
  }),
});

const announcements = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/announcements' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    description: z.string(),
    image: image().optional(),
    pubDate: z.coerce.date(),
    expiryDate: z.coerce.date().optional(),
    featured: z.boolean().default(false),
  }),
});

const gallery = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/gallery' }),
  schema: ({ image }) => z.object({
    title: z.string(),
    event: z.string().default(''),
    date: z.coerce.date(),
    photos: z.array(
      z.object({
        image: image(),
        caption: z.string().default(''),
      })
    ),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/site' }),
  schema: z.object({
    heroTitle: z.string(),
    heroHighlight: z.string().default(''),
    heroDescription: z.string(),
    featuredArticle: z.string().optional(),
    featuredEvent: z.string().optional(),
    announcementBanner: z.string().optional(),
    selectedGallery: z.string().optional(),
  }),
});

export const collections = { articles, events, announcements, gallery, site };
