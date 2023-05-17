import React from 'react';

const Modal = ({ x =100, y=100, text="Lorem Ipsum" }) => {
  
    const style = {
        position: 'absolute',
        top: y,
        left: x,
        backgroundColor: 'white',
        padding: '5px',
        borderRadius: '5px',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.3)',
        zIndex: 9999,
      };
      
      return <div style={style}>{text}</div>;
};

export default Modal;