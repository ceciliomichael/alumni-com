import React from 'react';

interface ImagePlaceholderProps {
  shape?: 'circle' | 'square' | 'rectangle';
  width?: string;
  height?: string;
  color?: string;
  text?: string;
  recommendedSize?: string;
}

const ImagePlaceholder = ({
  shape = 'rectangle',
  width = '100%',
  height = '150px',
  color = '#3498db',
  text,
  recommendedSize = '800x600px'
}: ImagePlaceholderProps) => {
  const borderRadius = shape === 'circle' ? '50%' : shape === 'square' ? '8px' : '4px';
  
  return (
    <div 
      className="image-placeholder"
      style={{
        backgroundColor: color,
        borderRadius,
        width,
        height,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
        overflow: 'hidden',
        position: 'relative'
      }}
    >
      {text && <div style={{ fontSize: '24px', marginBottom: '5px' }}>{text}</div>}
      <div style={{ fontSize: '12px', opacity: 0.8 }}>Recommended: {recommendedSize}</div>
    </div>
  );
};

export default ImagePlaceholder; 