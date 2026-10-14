import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Contact() {
    const [contact, setContact] = useState({
        phone: '03123456789',
        email: 'info@jawanbikers.com',
        address: 'Karachi, Sindh, Pakistan',
        facebook: 'Jawan Bikers',
        instagram: 'Jawan Bikers',
        tiktok: 'Jawan Bikers'
    });

    useEffect(() => {
        axios.get('http://localhost:5000/api/contact')
            .then(res => {
                if (res.data) {
                    setContact(prev => ({
                        ...prev,
                        ...res.data
                    }));
                }
            })
            .catch(err => console.log('Using default contact details:', err));
    }, []);

    return (
        <div style={{ color: '#fff', paddingBottom: '70px' }}>
            
            {/* 1. Hero Header Section */}
            <div style={{ 
                textAlign: 'center', 
                padding: '70px 20px 40px 20px', 
                background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), #111',
                borderBottom: '2px solid #222'
            }}>
                <h1 style={{ 
                    fontSize: '44px', 
                    color: '#ffcc00', 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px', 
                    marginBottom: '15px' 
                }}>
                    Get In Touch
                </h1>
                <p style={{ 
                    fontSize: '18px', 
                    color: '#ccc', 
                    maxWidth: '700px', 
                    margin: '0 auto', 
                    lineHeight: '1.6' 
                }}>
                    Have questions about our upcoming rides, sponsorship, or community membership? Reach out to us anytime!
                </p>
            </div>

            {/* 2. Contact Details Card Section */}
            <div style={{ maxWidth: '850px', margin: '50px auto', padding: '0 20px' }}>
                <div style={{ 
                    background: '#161616', 
                    border: '1px solid #333', 
                    borderRadius: '16px', 
                    padding: '40px', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.8)'
                }}>
                    <h2 style={{ 
                        color: '#ffcc00', 
                        textAlign: 'center', 
                        marginBottom: '35px', 
                        fontSize: '28px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        Official Contact Information
                    </h2>

                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
                        gap: '25px',
                        marginBottom: '40px'
                    }}>
                        {/* Phone */}
                        <div style={{ background: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #2a2a2a', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📞</div>
                            <h3 style={{ color: '#ffcc00', margin: '0 0 8px 0', fontSize: '18px' }}>Phone / WhatsApp</h3>
                            <p style={{ color: '#fff', fontSize: '18px', fontWeight: 'bold', margin: 0 }}>{contact.phone}</p>
                        </div>

                        {/* Email */}
                        <div style={{ background: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #2a2a2a', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>✉️</div>
                            <h3 style={{ color: '#ffcc00', margin: '0 0 8px 0', fontSize: '18px' }}>Email Address</h3>
                            <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>{contact.email}</p>
                        </div>

                        {/* Location */}
                        <div style={{ background: '#1e1e1e', padding: '25px', borderRadius: '12px', border: '1px solid #2a2a2a', textAlign: 'center' }}>
                            <div style={{ fontSize: '32px', marginBottom: '10px' }}>📍</div>
                            <h3 style={{ color: '#ffcc00', margin: '0 0 8px 0', fontSize: '18px' }}>Base Location</h3>
                            <p style={{ color: '#fff', fontSize: '16px', margin: 0 }}>{contact.address}</p>
                        </div>
                    </div>

                    <hr style={{ borderColor: '#282828', margin: '30px 0' }} />

                    {/* Social Media Channels */}
                    <h3 style={{ color: '#ffcc00', textAlign: 'center', marginBottom: '20px', fontSize: '22px' }}>
                        Follow & Connect With Us
                    </h3>

                    <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        gap: '20px', 
                        flexWrap: 'wrap' 
                    }}>
                        <div style={{ 
                            background: '#222', 
                            padding: '12px 24px', 
                            borderRadius: '30px', 
                            border: '1px solid #444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>
                            <span>📘 Facebook:</span>
                            <span style={{ color: '#ffcc00' }}>{contact.facebook}</span>
                        </div>

                        <div style={{ 
                            background: '#222', 
                            padding: '12px 24px', 
                            borderRadius: '30px', 
                            border: '1px solid #444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>
                            <span>📸 Instagram:</span>
                            <span style={{ color: '#ffcc00' }}>{contact.instagram}</span>
                        </div>

                        <div style={{ 
                            background: '#222', 
                            padding: '12px 24px', 
                            borderRadius: '30px', 
                            border: '1px solid #444',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: '#fff'
                        }}>
                            <span>🎵 TikTok:</span>
                            <span style={{ color: '#ffcc00' }}>{contact.tiktok}</span>
                        </div>
                    </div>

                </div>
            </div>

        </div>
    );
}