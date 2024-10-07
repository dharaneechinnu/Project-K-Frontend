import React, { useState } from 'react';
import { Briefcase, GraduationCap, Home, Users, UserPlus, Flower } from 'lucide-react';

const WhoIsThisFor = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const forAudience = [
    { icon: <Briefcase />, title: 'For Working Professionals', description: 'Find balance in your busy life and manage stress effectively.' },
    { icon: <Home />, title: 'For Homemakers', description: 'Discover inner peace amid daily responsibilities.' },
    { icon: <GraduationCap />, title: 'For Students', description: 'Improve focus, reduce anxiety, and achieve academic goals.' },
    { icon: <Users />, title: 'For Parents', description: 'Learn techniques to stay calm and patient with your children.' },
    { icon: <UserPlus />, title: 'For Teenagers & Young Adults', description: 'Navigate life transitions and build emotional resilience.' },
    { icon: <Flower />, title: 'For Spiritual Seekers', description: 'Deepen your practice and explore spiritual growth.' },
  ];

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      textAlign: 'center',
      color: '#3b82f6',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '24px',
    },
    item: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      transition: 'all 0.3s ease',
    },
    itemHovered: {
      transform: 'scale(1.03)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    iconWrapper: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '8px',
    },
    icon: {
      color: '#3b82f6',
      marginRight: '12px',
      transition: 'transform 0.3s ease',
    },
    iconHovered: {
      transform: 'rotate(360deg)',
    },
    itemTitle: {
      fontWeight: 'bold',
      fontSize: '18px',
    },
    description: {
      color: '#4b5563',
      fontSize: '14px',
      maxHeight: '0',
      overflow: 'hidden',
      transition: 'max-height 0.3s ease, opacity 0.3s ease',
      opacity: 0,
    },
    descriptionVisible: {
      maxHeight: '100px',
      opacity: 1,
    },
  };

  return (
    <div style={styles.container} id='about'>
      <h2 style={styles.title}>Who is this for? <span style={{color: '#22c55e'}}>✓</span></h2>
      <div style={styles.grid}>
        {forAudience.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.item,
              ...(hoveredIndex === index ? styles.itemHovered : {}),
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={styles.iconWrapper}>
              <div style={{
                ...styles.icon,
                ...(hoveredIndex === index ? styles.iconHovered : {}),
              }}>
                {item.icon}
              </div>
              <h3 style={styles.itemTitle}>{item.title}</h3>
            </div>
            <p style={{
              ...styles.description,
              ...(hoveredIndex === index ? styles.descriptionVisible : {}),
            }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoIsThisFor;