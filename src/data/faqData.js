/**
 * Shared FAQ data — single source of truth for both the visible FAQ accordion
 * and the JSON-LD FAQPage schema. Keeping them in one place guarantees content
 * parity (a Google requirement for FAQPage structured data).
 *
 * Each entry has:
 *   - question:   plain text (used by both UI heading and JSON-LD)
 *   - answerHtml: HTML string rendered in the accordion via dangerouslySetInnerHTML
 *   - answerText: plain text version for JSON-LD (no HTML tags)
 *
 * The "What sizes are available?" answer contains a `{DYNAMIC_SIZES}` token that
 * the FAQ UI component replaces at runtime with live data from Supabase.
 * The JSON-LD version uses the static fallback sizes.
 */

export const DYNAMIC_SIZES_TOKEN = '{DYNAMIC_SIZES}';

export const FAQ_DATA = [
  {
    question: 'How long does delivery take?',
    answerHtml:
      'Standard orders are delivered within <strong>2–4 weeks</strong>. Custom orders typically take <strong>4–6 weeks</strong> depending on complexity and size. We confirm the exact lead time when you place your order.',
    answerText:
      'Standard orders are delivered within 2–4 weeks. Custom orders typically take 4–6 weeks depending on complexity and size. We confirm the exact lead time when you place your order.',
  },
  {
    question: 'Can I get samples before ordering?',
    answerHtml:
      'Yes! We strongly recommend ordering samples first. Click the <strong>"Order Samples"</strong> button at the top of the page to request physical samples delivered to your address.',
    answerText:
      'Yes! We strongly recommend ordering samples first. Click the "Order Samples" button at the top of the page to request physical samples delivered to your address.',
  },
  {
    question: 'What sizes are available?',
    answerHtml: `Our standard tile sizes are ${'{DYNAMIC_SIZES}'}. We also offer fully custom sizes for projects - contact us to discuss your requirements.`,
    answerText:
      'Our standard tile sizes are 30×30 cm, 60×60 cm, and 60×120 cm. We also offer fully custom sizes for projects - contact us to discuss your requirements.',
  },
  {
    question: 'How do I install terrazzo tiles?',
    answerHtml:
      'Terrazzo tiles should be installed by a professional using a suitable adhesive for stone tiles. Ensure the subfloor is clean, flat, and dry. Grout joints of <strong>1.5–2 mm</strong> are recommended.',
    answerText:
      'Terrazzo tiles should be installed by a professional using a suitable adhesive for stone tiles. Ensure the subfloor is clean, flat, and dry. Grout joints of 1.5–2 mm are recommended.',
  },
  {
    question: 'How do I clean and maintain terrazzo?',
    answerHtml:
      'Use a <strong>pH-neutral cleaner</strong> and a damp mop for daily cleaning — avoid acidic cleaners like vinegar as they can etch the surface. Re-seal every <strong>1–2 years</strong> depending on traffic.',
    answerText:
      'Use a pH-neutral cleaner and a damp mop for daily cleaning — avoid acidic cleaners like vinegar as they can etch the surface. Re-seal every 1–2 years depending on traffic.',
  },
  {
    question: 'Do you ship internationally?',
    answerHtml:
      'Yes, we ship worldwide. Shipping costs and times vary by destination. Please contact us at <a href="https://mail.google.com/mail/?view=cm&to=limfactoryy@gmail.com" target="_blank" style="color: var(--accent-color);">limfactoryy@gmail.com</a> for a quote.',
    answerText:
      'Yes, we ship worldwide. Shipping costs and times vary by destination. Please contact us for a quote.',
  },
  {
    question: 'What is the minimum order quantity?',
    answerHtml:
      'For standard collections, the minimum order is <strong>20 sqft</strong>. For custom orders, minimums may vary.',
    answerText:
      'For standard collections, the minimum order is 20 sqft. For custom orders, minimums may vary.',
  },
];
