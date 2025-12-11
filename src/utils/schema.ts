/**
 * Schema.org JSON-LD generation utilities for AEO optimization
 * Generates Article, FAQPage, and HowTo structured data
 */

import type { CollectionEntry } from 'astro:content';

// Type aliases for cleaner code
type Guide = CollectionEntry<'guides'>;

interface FAQItem {
  question: string;
  answer: string;
}

// HowToStep type is inferred from Guide.data.howToSteps

// Site configuration
const SITE_URL = 'https://pyeongsu-calculator.kr';
const SITE_NAME = '평수계산기';
const LOGO_URL = `${SITE_URL}/logo.png`;

/**
 * Generates Article schema for a guide
 * Always included for every guide page
 */
export function generateArticleSchema(guide: Guide): object {
  const { data } = guide;

  return {
    '@type': 'Article',
    '@id': `${data.canonical}#article`,
    headline: data.title,
    description: data.description,
    datePublished: data.publishDate.toISOString(),
    ...(data.updatedDate && {
      dateModified: data.updatedDate.toISOString(),
    }),
    author: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: LOGO_URL,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': data.canonical,
    },
    keywords: data.keywords.join(', '),
  };
}

/**
 * Generates FAQPage schema for guides with FAQ content
 * Only included when faqs array is present and non-empty
 */
export function generateFAQSchema(faqs: FAQItem[], canonicalUrl: string): object {
  return {
    '@type': 'FAQPage',
    '@id': `${canonicalUrl}#faq`,
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generates HowTo schema for guides with step-by-step instructions
 * Only included when howToSteps array is present and non-empty
 */
export function generateHowToSchema(guide: Guide): object {
  const { data } = guide;

  if (!data.howToSteps || data.howToSteps.length === 0) {
    throw new Error('HowTo schema requires howToSteps array');
  }

  return {
    '@type': 'HowTo',
    '@id': `${data.canonical}#howto`,
    name: data.title,
    description: data.description,
    step: data.howToSteps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

/**
 * Generates complete JSON-LD graph for a guide
 * Combines Article, FAQPage, and HowTo schemas as applicable
 */
export function generateSchemaGraph(guide: Guide): object {
  const { data } = guide;
  const schemas: object[] = [];

  // Article schema is always included
  schemas.push(generateArticleSchema(guide));

  // Add FAQPage schema if FAQs are present
  if (data.faqs && data.faqs.length > 0) {
    schemas.push(generateFAQSchema(data.faqs, data.canonical));
  }

  // Add HowTo schema if steps are present
  if (data.howToSteps && data.howToSteps.length > 0) {
    schemas.push(generateHowToSchema(guide));
  }

  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}
