import React, { useState } from 'react';

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`faq-item ${isOpen ? 'open' : ''}`}>
      <button className="faq-question" onClick={() => setIsOpen(!isOpen)}>
        {question} <span className="faq-icon">+</span>
      </button>
      <div className="faq-answer">
        <p dangerouslySetInnerHTML={{ __html: answer }}></p>
      </div>
    </div>
  );
};

const FAQ = () => {
  const faqs = [
    { question: 'How long does delivery take?', answer: 'Standard orders are delivered within <strong>2–4 weeks</strong>. Custom and bespoke orders typically take <strong>4–6 weeks</strong> depending on complexity and size. We confirm the exact lead time when you place your order.' },
    { question: 'Can I get samples before ordering?', answer: 'Yes! We strongly recommend ordering samples first. Click the <strong>"Order Samples"</strong> button at the top of the page to request physical samples delivered to your address.' },
    { question: 'What sizes are available?', answer: 'Our standard tile sizes are <strong>30×30 cm</strong>, <strong>60×60 cm</strong>, and <strong>60×120 cm</strong>. We also offer fully custom sizes for bespoke projects.' },
    { question: 'How do I install terrazzo tiles?', answer: 'Terrazzo tiles should be installed by a professional using a suitable adhesive for stone tiles. Ensure the subfloor is clean, flat, and dry. Grout joints of <strong>1.5–2 mm</strong> are recommended.' },
    { question: 'How do I clean and maintain terrazzo?', answer: 'Use a <strong>pH-neutral cleaner</strong> and a damp mop for daily cleaning — avoid acidic cleaners like vinegar as they can etch the surface. Re-seal every <strong>1–2 years</strong> depending on traffic.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide. Shipping costs and times vary by destination. Please contact us at <a href="mailto:limfactoryy@gmail.com" target="_blank" style="color: var(--accent-color);">limfactoryy@gmail.com</a> for a quote.' },
    { question: 'What is the minimum order quantity?', answer: 'For standard collections, the minimum order is <strong>5 sqm</strong>. For custom and bespoke orders, minimums may vary.' },
  ];

  return (
    <section id="faq" className="section bg-dark">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <FAQItem key={index} question={faq.question} answer={faq.answer} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
