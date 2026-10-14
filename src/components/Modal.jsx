import React from 'react';

export default function Modal({ isOpen, onClose, title, message, type = 'info' }) {
    if (!isOpen) return null;

    const getIcon = () => {
        if (type === 'success') return '✅';
        if (type === 'error') return '⚠️';
        return 'ℹ️';
    };

    const getBorderColor = () => {
        if (type === 'success') return '#28a745';
        if (type === 'error') return '#dc3545';
        return '#ffcc00';
    };

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2000,
            padding: '20px',
            animation: 'fadeIn 0.2s ease-in-out'
        }}>
            <div style={{
                background: '#181818',
                border: `2px solid ${getBorderColor()}`,
                borderRadius: '16px',
                padding: '30px 35px',
                maxWidth: '450px',
                width: '100%',
                textAlign: 'center',
                boxShadow: '0 10px 35px rgba(0,0,0,0.9)',
                color: '#fff'
            }}>
                <div style={{ fontSize: '48px', marginBottom: '15px' }}>{getIcon()}</div>
                <h3 style={{ color: '#ffcc00', fontSize: '24px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {title || 'Notification'}
                </h3>
                <p style={{ color: '#ccc', fontSize: '16px', lineHeight: '1.6', marginBottom: '25px' }}>
                    {message}
                </p>
                <button 
                    onClick={onClose}
                    style={{
                        backgroundColor: '#ffcc00',
                        color: '#000',
                        border: 'none',
                        padding: '12px 30px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        fontSize: '16px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}
                >
                    Continue
                </button>
            </div>
        </div>
    );
}