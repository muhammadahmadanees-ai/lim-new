/**
 * JsonLdSchema — Server Component
 *
 * Statically renders unified Schema.org @graph JSON-LD structured data into the HTML <head>.
 * Built strictly according to the Technical SEO & Schema.org Audit for limfactory.co.
 *
 * Entities included in the single @graph:
 *   - Organization (with @id, logo ImageObject, contactPoint array, social sameAs, and address)
 *   - WebSite (with @id and publisher reference)
 *   - WebPage (homepage node tying WebSite and Organization together, with video reference)
 *   - FAQPage (Q&As drawn from shared faqData.js for visible parity)
 *   - Service ("Custom Terrazzo Flooring" offering with full catalog per Section 4.3)
 *   - VideoObject (hero video with duration per Section 4.1)
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
      url: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/lim_transparent_logo.png`,
      contentUrl: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/lim_transparent_logo.png`,
      width: '512',
      height: '512',
    },
    image: `${BASE_URL}/tiles_cover.png`,
    description:
      'LIM Factory handcrafts premium terrazzo tiles and terrazzo chips tiles from 100% recycled marble, offering custom terrazzo flooring for residential and commercial spaces across Asia.',
    email: 'limfactoryy@gmail.com',
    telephone: '+92-316-4934687',
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+92-316-4934687',
        contactType: 'sales',
        email: 'limfactoryy@gmail.com',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Urdu'],
      },
      {
        '@type': 'ContactPoint',
        telephone: '+92-333-7000737',
        contactType: 'customer service',
        areaServed: 'Worldwide',
        availableLanguage: ['English', 'Urdu'],
      },
    ],
    sameAs: [
      'https://www.instagram.com/terrazzobylimfactory',
      'https://wa.me/923164934687',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Main Road Lahore–Kasur Road',
      addressLocality: 'Kasur',
      addressRegion: 'Punjab',
      addressCountry: 'PK',
    },
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
      'Buy premium terrazzo tiles and terrazzo chips tiles handcrafted from 100% recycled marble. Custom terrazzo flooring for residential & commercial spaces across Asia.',
    isPartOf: { '@id': `${BASE_URL}/#website` },
    about: { '@id': `${BASE_URL}/#organization` },
    primaryImageOfPage: {
      '@type': 'ImageObject',
      url: `${BASE_URL}/tiles_cover.png`,
      width: 1200,
      height: 630,
    },
    inLanguage: 'en-US',
    video: { '@id': `${BASE_URL}/#herovideo` },
  };

  const faqPage = {
    '@type': 'FAQPage',
    '@id': `${BASE_URL}/#faq`,
    mainEntityOfPage: { '@id': `${BASE_URL}/#webpage` },
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
    '@id': `${BASE_URL}/#service-custom-terrazzo`,
    serviceType: 'Custom Terrazzo Flooring Consultation',
    name: 'Custom Terrazzo Flooring by LIM Factory',
    description:
      'Custom-sized terrazzo tile solutions for residential and commercial flooring projects, handcrafted from 100% recycled marble.',
    provider: { '@id': `${BASE_URL}/#organization` },
    areaServed: {
      '@type': 'Place',
      name: 'Worldwide',
    },
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'LIM Factory Services',
      itemListElement: [
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Free Sample Ordering',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Room Visualizer Consultation',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'Custom Tile Sizing',
          },
        },
        {
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: 'International Shipping',
          },
        },
      ],
    },
  };

  const videoObject = {
    '@type': 'VideoObject',
    '@id': `${BASE_URL}/#herovideo`,
    name: 'LIM Factory — Handcrafted Terrazzo Tiles Showcase',
    description:
      'A showcase of LIM Factory\'s handcrafted terrazzo tiles, made from 100% recycled marble, for residential and commercial flooring.',
    thumbnailUrl: [`${BASE_URL}/tiles_cover.png`],
    uploadDate: '2026-01-15T08:00:00+00:00',
    duration: 'PT0M28S',
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
