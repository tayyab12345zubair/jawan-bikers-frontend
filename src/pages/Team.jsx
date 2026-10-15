import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Team() {
    const [team, setTeam] = useState([]);

    useEffect(() => {
        axios.get('https://jawan-bikers-backend.vercel.app/api/team')
            .then(res => setTeam(res.data))
            .catch(err => console.log(err));
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
                    fontSize: '46px', 
                    color: '#ffcc00', 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px', 
                    marginBottom: '15px' 
                }}>
                    Meet Our Leadership & Team
                </h1>
                <p style={{ 
                    fontSize: '20px', 
                    color: '#ccc', 
                    maxWidth: '750px', 
                    margin: '0 auto', 
                    lineHeight: '1.6' 
                }}>
                    The passionate individuals working behind the scenes to organize safe, disciplined, and adventurous rides across Pakistan.
                </p>
            </div>

            {/* 2. Team Cards Section (Bade Cards) */}
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '50px 20px' }}>
                {team.length === 0 ? (
                    <div style={{ background: '#161616', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#888' }}>
                        Team profiles will appear here.
                    </div>
                ) : (
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                        gap: '35px',
                        justifyContent: 'center' 
                    }}>
                        {team.map(member => (
                            <div key={member._id} style={{ 
                                background: '#161616', 
                                border: '1px solid #333', 
                                borderRadius: '16px', 
                                padding: '35px 25px', 
                                textAlign: 'center',
                                boxShadow: '0 8px 25px rgba(0,0,0,0.7)',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                transition: 'transform 0.3s'
                            }}>
                                {/* Profile Image (Badi) */}
                                <img 
                                    src={member.pictureUrl} 
                                    alt={member.name} 
                                    style={{ 
                                        width: '140px', 
                                        height: '140px', 
                                        borderRadius: '50%', 
                                        objectFit: 'cover', 
                                        border: '4px solid #ffcc00', 
                                        marginBottom: '20px',
                                        boxShadow: '0 4px 15px rgba(255,204,0,0.3)'
                                    }} 
                                />

                                {/* Name (Bada Font) */}
                                <h2 style={{ 
                                    color: '#fff', 
                                    fontSize: '26px', 
                                    margin: '0 0 8px 0',
                                    fontWeight: 'bold'
                                }}>
                                    {member.name}
                                </h2>

                                {/* Role Badge */}
                                <span style={{ 
                                    backgroundColor: 'rgba(255, 204, 0, 0.15)', 
                                    color: '#ffcc00', 
                                    padding: '6px 16px', 
                                    borderRadius: '20px', 
                                    fontSize: '14px', 
                                    fontWeight: 'bold',
                                    marginBottom: '15px',
                                    border: '1px solid rgba(255,204,0,0.3)',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.5px'
                                }}>
                                    {member.role}
                                </span>

                                {/* Description */}
                                <p style={{ 
                                    fontSize: '15px', 
                                    color: '#aaa', 
                                    lineHeight: '1.6',
                                    margin: '0' 
                                }}>
                                    {member.description}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}