import React from 'react';
import { Link } from 'react-router-dom';

export default function About() {
    return (
        <div style={{ color: '#fff', paddingBottom: '60px' }}>
            
            {/* 1. Hero Header Section */}
            <div style={{ 
                textAlign: 'center', 
                padding: '80px 20px', 
                background: 'linear-gradient(rgba(0,0,0,0.85), rgba(0,0,0,0.85)), #111',
                borderBottom: '2px solid #222'
            }}>
                <h1 style={{ 
                    fontSize: '48px', 
                    color: '#ffcc00', 
                    textTransform: 'uppercase', 
                    letterSpacing: '2px', 
                    marginBottom: '15px' 
                }}>
                    About Jawan Bikers
                </h1>
                <p style={{ 
                    fontSize: '20px', 
                    color: '#ccc', 
                    maxWidth: '800px', 
                    margin: '0 auto', 
                    lineHeight: '1.6' 
                }}>
                    More than just a riding club — we are a passionate community bound by brotherhood, adventure, and the freedom of the open road.
                </p>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '50px 20px' }}>
                
                {/* 2. Our Mission & Story Section */}
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
                    gap: '40px', 
                    alignItems: 'center',
                    marginBottom: '70px' 
                }}>
                    <div style={{ background: '#161616', padding: '35px', borderRadius: '12px', border: '1px solid #333' }}>
                        <h2 style={{ color: '#ffcc00', marginTop: '0', fontSize: '28px' }}>Our Mission</h2>
                        <p style={{ color: '#ddd', lineHeight: '1.8', fontSize: '16px' }}>
                            Jawan Bikers was founded to unite motorcycle enthusiasts from across Pakistan. Our goal is to promote safe, disciplined, and thrill-packed group riding experiences while exploring the breathtaking landscapes and historic heritage of our country.
                        </p>
                        <p style={{ color: '#ddd', lineHeight: '1.8', fontSize: '16px' }}>
                            Whether you ride a 70cc commuter or a 1000cc superbike, our community welcomes every rider who respects the road, values safety, and cherishes true brotherhood.
                        </p>
                    </div>

                    {/* Stats Counter Grid */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: '1fr 1fr', 
                        gap: '20px' 
                    }}>
                        <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333' }}>
                            <h3 style={{ color: '#ffcc00', fontSize: '36px', margin: '0' }}>50+</h3>
                            <p style={{ color: '#aaa', margin: '5px 0 0 0', fontWeight: 'bold' }}>Rides Completed</p>
                        </div>
                        <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333' }}>
                            <h3 style={{ color: '#ffcc00', fontSize: '36px', margin: '0' }}>100+</h3>
                            <p style={{ color: '#aaa', margin: '5px 0 0 0', fontWeight: 'bold' }}>Active Members</p>
                        </div>
                        <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333' }}>
                            <h3 style={{ color: '#ffcc00', fontSize: '36px', margin: '0' }}>50+</h3>
                            <p style={{ color: '#aaa', margin: '5px 0 0 0', fontWeight: 'bold' }}>Destinations Covered</p>
                        </div>
                        <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', textAlign: 'center', border: '1px solid #333' }}>
                            <h3 style={{ color: '#ffcc00', fontSize: '36px', margin: '0' }}>100%</h3>
                            <p style={{ color: '#aaa', margin: '5px 0 0 0', fontWeight: 'bold' }}>Safety First Focus</p>
                        </div>
                    </div>
                </div>

                {/* 3. Core Values Grid */}
                <h2 style={{ textAlign: 'center', color: '#ffcc00', marginBottom: '40px', fontSize: '32px', textTransform: 'uppercase' }}>
                    Why Ride With Us?
                </h2>

                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                    gap: '25px', 
                    marginBottom: '60px' 
                }}>
                    <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', border: '1px solid #282828' }}>
                        <div style={{ fontSize: '30px', marginBottom: '10px' }}>🤝</div>
                        <h3 style={{ color: '#fff', marginTop: '0' }}>True Brotherhood</h3>
                        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.5' }}>
                            No rider gets left behind. We ride together, stay together, and support each other both on and off the road.
                        </p>
                    </div>

                    <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', border: '1px solid #282828' }}>
                        <div style={{ fontSize: '30px', marginBottom: '10px' }}>🛡️</div>
                        <h3 style={{ color: '#fff', marginTop: '0' }}>Safety First</h3>
                        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.5' }}>
                            Helmets, protective gear, and strict convoy rules are mandatory. We prioritize everyone's safety above all.
                        </p>
                    </div>

                    <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', border: '1px solid #282828' }}>
                        <div style={{ fontSize: '30px', marginBottom: '10px' }}>🏍️</div>
                        <h3 style={{ color: '#fff', marginTop: '0' }}>All Bikes Welcome</h3>
                        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.5' }}>
                            We respect the rider, not just the machine. Every functional bike with proper documents is welcome.
                        </p>
                    </div>

                    <div style={{ background: '#181818', padding: '25px', borderRadius: '10px', border: '1px solid #282828' }}>
                        <div style={{ fontSize: '30px', marginBottom: '10px' }}>⛰️</div>
                        <h3 style={{ color: '#fff', marginTop: '0' }}>Scenic Exploration</h3>
                        <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.5' }}>
                            From historical forts to coastal highways and mountain passes, we create epic memories across scenic routes.
                        </p>
                    </div>
                </div>

                {/* 4. Call to Action */}
                <div style={{ 
                    textAlign: 'center', 
                    background: 'linear-gradient(135deg, #1f1f1f, #111)', 
                    padding: '40px', 
                    borderRadius: '12px', 
                    border: '1px solid #ffcc00' 
                }}>
                    <h3 style={{ fontSize: '26px', color: '#ffcc00', margin: '0 0 10px 0' }}>Ready to Start Your Journey?</h3>
                    <p style={{ color: '#ccc', fontSize: '17px', marginBottom: '25px' }}>Become an official member of Jawan Bikers today and join our next fraternity ride!</p>
                    <Link to="/join" style={{ 
                        backgroundColor: '#ffcc00', 
                        color: '#000', 
                        padding: '14px 32px', 
                        borderRadius: '8px', 
                        fontWeight: 'bold', 
                        textDecoration: 'none', 
                        fontSize: '18px',
                        display: 'inline-block'
                    }}>
                        Join Community Now
                    </Link>
                </div>

            </div>
        </div>
    );
}