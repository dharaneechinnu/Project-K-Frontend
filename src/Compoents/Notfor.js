import React, { useState } from 'react';
import { XOctagon, Clock, UserX, Frown } from 'lucide-react';

const WhoThisProgramIsNotFor = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const notForAudience = [
    { icon: <XOctagon />, title: 'People in crisis', description: 'Seeking immediate medical attention' },
    { icon: <Clock />, title: 'Extremely intense time constraints', description: 'Unable to dedicate any time' },
    { icon: <UserX />, title: 'Children', description: 'Under age 13' },
    { icon: <Frown />, title: 'Those not serious', description: 'About their mental health' },
  ];

  const styles = {
    container: {
      maxWidth: '1000px',
      margin: '32px auto 0',
      padding: '24px',
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
      marginBottom:'80px',
    },
    title: {
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '24px',
      textAlign: 'center',
      color: '#dc2626',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
    },
    item: {
      backgroundColor: '#f9fafb',
      padding: '16px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
      textAlign: 'center',
      transition: 'all 0.3s ease',
    },
    itemHovered: {
      transform: 'scale(1.05)',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    },
    icon: {
      color: '#dc2626',
      marginBottom: '8px',
      transition: 'transform 0.3s ease',
    },
    iconHovered: {
      transform: 'rotate(360deg)',
    },
    itemTitle: {
      fontWeight: 'bold',
      fontSize: '16px',
      marginBottom: '4px',
    },
    description: {
      color: '#4b5563',
      fontSize: '12px',
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Who this program is not for <span>✗</span></h2>
      <div style={styles.grid}>
        {notForAudience.map((item, index) => (
          <div
            key={index}
            style={{
              ...styles.item,
              ...(hoveredIndex === index ? styles.itemHovered : {}),
            }}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div style={{
              ...styles.icon,
              ...(hoveredIndex === index ? styles.iconHovered : {}),
            }}>
              {item.icon}
            </div>
            <h3 style={styles.itemTitle}>{item.title}</h3>
            <p style={styles.description}>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WhoThisProgramIsNotFor;