export interface BreadcrumbItem {
  name: string;
  item: string;
}

export function generateBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.item,
    })),
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQJsonLd(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map((faq) => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  };
}

export interface HowToStep {
  name: string;
  text: string;
  url?: string;
}

export function generateHowToJsonLd(name: string, description: string, steps: HowToStep[], url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    'name': name,
    'description': description,
    'url': url,
    'step': steps.map((step, index) => ({
      '@type': 'HowToStep',
      'position': index + 1,
      'name': step.name,
      'text': step.text,
      'url': step.url || `${url}#step-${index + 1}`,
    })),
  };
}

export interface WebApplicationSchemaOptions {
  name: string;
  description: string;
  url: string;
  applicationCategory?: string;
  operatingSystem?: string;
  browserRequirements?: string;
}

export function generateWebApplicationJsonLd(options: WebApplicationSchemaOptions) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': options.name,
    'description': options.description,
    'url': options.url,
    'applicationCategory': options.applicationCategory || 'DeveloperApplication',
    'operatingSystem': options.operatingSystem || 'All',
    'browserRequirements': options.browserRequirements || 'Requires JavaScript. Requires HTML5.',
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD',
    },
  };
}

