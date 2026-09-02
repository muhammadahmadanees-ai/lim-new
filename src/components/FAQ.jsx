"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { FAQ_DATA, DYNAMIC_SIZES_TOKEN } from '../data/faqData';

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

  // Build the FAQ list from shared data, replacing the dynamic sizes token
  const faqs = FAQ_DATA.map((faq) => ({
    question: faq.question,
    answer: faq.answerHtml.includes(DYNAMIC_SIZES_TOKEN)
      ? faq.answerHtml.replace(DYNAMIC_SIZES_TOKEN, dynamicSizes)
      : faq.answerHtml,
  }));

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
