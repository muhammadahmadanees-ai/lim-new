/**
 * JsonLdSchema — Server Component
 *
 * Outputs a single <script type="application/ld+json"> tag containing
 * a @graph array with all sitewide structured data entities.
 *
 * This component is rendered in layout.jsx (server context), so the
 * JSON-LD is present in the initial HTML response — not injected after
 * client-side hydration.
 *
 * Entities included:
 *   - Organization (with @id, contactPoints, sameAs)
 *   - WebSite (with @id, publisher reference)
 *   - WebPage (homepage, with @id references)
 *   - FAQPage (from shared faqData.js)
 *   - Service (Custom Terrazzo Flooring)
 *   - VideoObject (hero video)
 */

import { FAQ_DATA } from '../data/faqData.js';

const BASE_URL = 'https://www.limfactory.co';

function buildJsonLdGraph() {
  const organization = {
    '@type': 'Organization',
    '@id': `${BASE_URL}/#organization`,
    name: 'LIM Factory',
    alternateName: 'LIM Factory Terrazzo',
    url: BASE_URL,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: 'https://wqkdkypfpgvubxfzokmg.supabase.co/storage/v1/object/public/images/lim_transparent_logo.png',
    },
    image: `${BASE_URL}/tiles_cover.png`,
    description:
      'LIM Factory handcrafts premium terrazzo tiles and terrazzo chips tiles from 100% recycled marble, offering custom terrazzo flooring for residential and commercial spaces across Asia.',
    email: 'limfactoryy@gmail.com',
    telephone: '+92-316-4934687',
    sameAs: ['https://www.instagram.com/terrazzobylimfactory'],
    areaServed: {
      '@type': 'Place',
      name: 'Asia',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-316-4934687',
        contactType: 'sales',
        email: 'limfactoryy@gmail.com',
        areaServed: 'Asia',
        availableLanguage: ['English'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+92-333-7000737',
        contactType: 'customer support',
        areaServed: 'Asia',
        availableLanguage: ['English'],
      },
    ],
  };

  const webSite = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: BASE_URL,
    name: 'LIM Factory',
    description:
      'Premium terrazzo tiles and terrazzo chips tiles handcrafted from 100% recycled marble.',
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-US',
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/#webpage`,
    url: BASE_URL,
    name: 'LIM Factory | Premium Terrazzo Tiles & Terrazzo Chips Tiles',
    description:
      'Buy premium terrazzo tiles and terrazzo chips tiles handcrafted from 100% recycled marble. LIM Factory offers custom terrazzo flooring for residential & commercial spaces across Asia.',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/tiles_cover.png`,
      width: 1200,
      height: 630,
    },
    inLanguage: 'en-US',
  };

  const faqPage = {
    '@type': 'FAQPage',
    mainEntity: FAQ_DATA.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answerText,
      },
    })),
  };

  const service = {
    '@type': 'Service',
    serviceType: 'Custom Terrazzo Flooring',
    name: 'Custom Terrazzo Flooring by LIM Factory',
    description:
      'Fully custom-sized terrazzo tile and terrazzo chips flooring solutions for residential and commercial projects, handcrafted from 100% recycled marble.',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: {
      '@type': 'Place',
      name: 'Asia',
    },
    audience: {
      '@type': 'Audience',
      audienceType: [
        'Homeowners',
        'Architects',
        'Interior Designers',
        'Commercial Developers',
      ],
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Terrazzo Collections',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Size Terrazzo Tiles',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Sample Ordering',
          },
        },
      ],
    },
  };

  const videoObject = {
    '@type': 'VideoObject',
    name: 'LIM Factory — Terrazzo Tiles Showcase',
    description:
      'A showcase of LIM Factory\'s handcrafted terrazzo tiles made from 100% recycled marble.',
    thumbnailUrl: `${BASE_URL}/tiles_cover.png`,
    // TODO_NEEDS_INPUT: Replace with the real ISO 8601 date the video was published
    uploadDate: 'TODO_NEEDS_INPUT',
    contentUrl:
      'https://res.cloudinary.com/doiujqcpw/video/upload/v1780236097/IMG_0671_cektka.mp4',
    publisher: { '@id': `${BASE_URL}/#organization` },
  };

  return {
    '@context': 'https://schema.org',
    '@graph': [organization, webSite, webPage, faqPage, service, videoObject],
  };
}

export default function JsonLdSchema() {
  const jsonLd = buildJsonLdGraph();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
