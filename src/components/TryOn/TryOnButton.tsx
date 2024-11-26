import React from 'react';

interface TryOnButtonProps {
    onClick: () => void; // Function to trigger the Try-On modal
}

const TryOnButton: React.FC<TryOnButtonProps> = ({ onClick }) => {
    return (
        <button onClick={onClick} style={buttonStyle}>
            Try On
        </button>
    );
};

const buttonStyle: React.CSSProperties = {
    padding: '10px 20px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '1rem',
    margin: '10px 0',
};

export default TryOnButton;