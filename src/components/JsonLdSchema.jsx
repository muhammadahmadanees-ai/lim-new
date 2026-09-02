/**
 * JsonLdSchema — Server Component
 *
 * Statically renders unified Schema.org @graph JSON-LD structured data into the HTML <head>.
 * Built strictly according to the Technical SEO & Schema.org Audit for limfactory.co.
 *
 * Entities included in the single @graph:
 *   - Organization (with @id, logo ImageObject, contactPoint array, social sameAs, and address)
 *   - WebSite (with @id and publisher reference)
 *   - WebPage (homepage node tying WebSite and Organization together)
 *   - FAQPage (Q&As drawn from shared faqData.js for visible parity)
 *   - Service ("Custom Terrazzo Flooring" offering)
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
    url: `${BASE_URL}/`,
    logo: {
      '@type': 'ImageObject',
      '@id': `${BASE_URL}/#logo`,
      url: 'https://wqkdkypfpgvubxfzokmg.supabase.co/storage/v1/object/public/images/lim_transparent_logo.png',
      contentUrl: 'https://wqkdkypfpgvubxfzokmg.supabase.co/storage/v1/object/public/images/lim_transparent_logo.png',
      width: '512',
      height: '512',
    },
    image: `${BASE_URL}/tiles_cover.png`,
    description:
      'LIM Factory designs and manufactures premium terrazzo tiles and terrazzo chip tiles handcrafted from 100% recycled marble, offering custom terrazzo flooring for residential and commercial spaces.',
    email: 'limfactoryy@gmail.com',
    telephone: '+92-316-4934687',
    sameAs: ['https://www.instagram.com/terrazzobylimfactory'],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lahore',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-316-4934687',
        contactType: 'customer service',
        email: 'limfactoryy@gmail.com',
        areaServed: 'Worldwide',
        availableLanguage: ['en', 'ur'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+92-333-7000737',
        contactType: 'sales',
        areaServed: 'Worldwide',
        availableLanguage: ['en', 'ur'],
      },
    ],
  };

  const webSite = {
    '@type': 'WebSite',
    '@id': `${BASE_URL}/#website`,
    url: `${BASE_URL}/`,
    name: 'LIM Factory',
    description:
      'Premium terrazzo tiles and terrazzo chips tiles handcrafted from 100% recycled marble.',
    publisher: { '@id': `${BASE_URL}/#organization` },
    inLanguage: 'en-US',
  };

  const webPage = {
    '@type': 'WebPage',
    '@id': `${BASE_URL}/#webpage`,
    url: `${BASE_URL}/`,
    name: 'LIM Factory | Premium Terrazzo Tiles & Terrazzo Chips Tiles',
    description:
      'Buy premium terrazzo tiles and terrazzo chips tiles handcrafted from 100% recycled marble. LIM Factory offers custom terrazzo flooring for residential & commercial spaces across Asia. Request free samples today.',
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
    '@id': `${BASE_URL}/#faq`,
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
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
      'Custom terrazzo flooring and terrazzo chip tile manufacturing for residential and commercial spaces, in standard or fully custom sizes.',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
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
    name: 'LIM Factory — Handcrafted Terrazzo Tile Process',
    description:
      'A look at LIM Factory\'s handcrafted terrazzo tile production from 100% recycled marble.',
    thumbnailUrl: [`${BASE_URL}/tiles_cover.png`],
    uploadDate: '2026-01-15',
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
