"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';

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
  const [dynamicSizes, setDynamicSizes] = useState('<strong>30×30 cm</strong>, <strong>60×60 cm</strong>, and <strong>60×120 cm</strong>');

  useEffect(() => {
    const fetchSizes = async () => {
      try {
        const { data: colSnap, error: colError } = await supabase.from('collections').select('*');
        if (colError) throw colError;
        let allSizes = new Set();
        let promises = [];
        colSnap.forEach(col => {
          if (col.type !== 'category') {
            promises.push(supabase.from('products').select('*').eq('collection_id', col.id).then(res => {
              if (res.data) {
                res.data.forEach(pData => {
                  const sizes = pData.sizes || pData.size || pData.availablesizes || pData.available_sizes || pData['available sizes'] || pData['Available Sizes'];
                  if (sizes) {
                    if (typeof sizes === 'string') {
                      sizes.split(',').forEach(s => allSizes.add(s.trim()));
                    } else if (Array.isArray(sizes)) {
                      sizes.forEach(s => allSizes.add(s));
                    }
                  }
                });
              }
            }));
          }
        });
        await Promise.all(promises);

        const sizesArray = Array.from(allSizes).filter(s => s && s.trim().length > 0);
        if (sizesArray.length > 0) {
          let formattedSizes = sizesArray.map(s => `<strong>${s.replace(/x/gi, '×')} cm</strong>`);
          let finalString = '';
          if (formattedSizes.length === 1) finalString = formattedSizes[0];
          else if (formattedSizes.length === 2) finalString = `${formattedSizes[0]} and ${formattedSizes[1]}`;
          else {
            const last = formattedSizes.pop();
            finalString = `${formattedSizes.join(', ')}, and ${last}`;
          }
          setDynamicSizes(finalString);
        }
      } catch (err) {
        console.error("Error fetching dynamic sizes:", err);
      }
    };
    fetchSizes();
  }, []);

  const faqs = [
    { question: 'How long does delivery take?', answer: 'Standard orders are delivered within <strong>2–4 weeks</strong>. Custom orders typically take <strong>4–6 weeks</strong> depending on complexity and size. We confirm the exact lead time when you place your order.' },
    { question: 'Can I get samples before ordering?', answer: 'Yes! We strongly recommend ordering samples first. Click the <strong>"Order Samples"</strong> button at the top of the page to request physical samples delivered to your address.' },
    { question: 'What sizes are available?', answer: `Our standard tile sizes are ${dynamicSizes}. We also offer fully custom sizes for projects - contact us to discuss your requirements.` },
    { question: 'How do I install terrazzo tiles?', answer: 'Terrazzo tiles should be installed by a professional using a suitable adhesive for stone tiles. Ensure the subfloor is clean, flat, and dry. Grout joints of <strong>1.5–2 mm</strong> are recommended.' },
    { question: 'How do I clean and maintain terrazzo?', answer: 'Use a <strong>pH-neutral cleaner</strong> and a damp mop for daily cleaning — avoid acidic cleaners like vinegar as they can etch the surface. Re-seal every <strong>1–2 years</strong> depending on traffic.' },
    { question: 'Do you ship internationally?', answer: 'Yes, we ship worldwide. Shipping costs and times vary by destination. Please contact us at <a href="https://mail.google.com/mail/?view=cm&to=limfactoryy@gmail.com" target="_blank" style="color: var(--accent-color);">limfactoryy@gmail.com</a> for a quote.' },
    { question: 'What is the minimum order quantity?', answer: 'For standard collections, the minimum order is <strong>20 sqft</strong>. For custom orders, minimums may vary.' },
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
