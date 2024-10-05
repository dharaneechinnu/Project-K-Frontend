import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

const FAQComponent = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqData = [
    {
      question: "What is Soul Streach?",
      answer: "Soul Streach is a comprehensive mental wellness program designed to help individuals find balance, reduce stress, and improve overall well-being through mindfulness practices, guided meditation, and personalized growth strategies."
    },
    {
      question: "How often should I practice the techniques?",
      answer: "For best results, we recommend practicing the Soul Streach techniques daily, even if just for 10-15 minutes. Consistency is key to experiencing the full benefits of the program."
    },
    {
      question: "Is Soul Streach suitable for beginners?",
      answer: "Absolutely! Soul Streach is designed for individuals at all levels, from complete beginners to those with experience in mindfulness and meditation. Our program offers a gradual progression to accommodate all skill levels."
    },
    {
      question: "Can I access Soul Streach on multiple devices?",
      answer: "Yes, you can access Soul Streach on any device with an internet connection. Our platform is fully responsive and works seamlessly on desktops, laptops, tablets, and smartphones."
    },
    {
      question: "What if I'm not satisfied with the program?",
      answer: "We offer a 30-day money-back guarantee. If you're not completely satisfied with Soul Streach within the first 30 days, you can request a full refund, no questions asked."
    }
  ];

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '32px auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#3b82f6',
      textAlign: 'center',
      marginBottom: '24px',
    },
    faqItem: {
      borderBottom: '1px solid #e5e7eb',
      marginBottom: '16px',
      paddingBottom: '16px',
    },
    question: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      cursor: 'pointer',
      fontSize: '18px',
      fontWeight: '600',
      color: '#1f2937',
      transition: 'color 0.3s ease',
    },
    questionHover: {
      color: '#3b82f6',
    },
    answer: {
      maxHeight: '0',
      overflow: 'hidden',
      transition: 'max-height 0.5s ease, padding 0.5s ease',
      fontSize: '16px',
      color: '#4b5563',
    },
    answerActive: {
      maxHeight: '300px',
      paddingTop: '12px',
    },
    icon: {
      transition: 'transform 0.3s ease',
    },
    iconActive: {
      transform: 'rotate(180deg)',
    },
  };

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Frequently Asked Questions</h2>
      {faqData.map((faq, index) => (
        <div key={index} style={styles.faqItem}>
          <div
            style={{
              ...styles.question,
              ...(activeIndex === index ? styles.questionHover : {}),
            }}
            onClick={() => toggleQuestion(index)}
            onMouseEnter={(e) => e.target.style.color = '#3b82f6'}
            onMouseLeave={(e) => e.target.style.color = activeIndex === index ? '#3b82f6' : '#1f2937'}
          >
            <span>{faq.question}</span>
            <span style={{
              ...styles.icon,
              ...(activeIndex === index ? styles.iconActive : {}),
            }}>
              {activeIndex === index ? <ChevronUp /> : <ChevronDown />}
            </span>
          </div>
          <div style={{
            ...styles.answer,
            ...(activeIndex === index ? styles.answerActive : {}),
          }}>
            {faq.answer}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FAQComponent;