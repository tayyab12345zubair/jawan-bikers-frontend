import React from 'react';
import { Link } from 'react-router-dom';
import bgImage from '../bike-bg.jpeg';

export default function Home() {
    return (
        <div style={{ 
            textAlign: 'center', 
            padding: '120px 20px', 
            minHeight: '85vh', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'center', 
            alignItems: 'center', 
            backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <h1 style={{ 
                fontSize: '60px', 
                color: '#ffcc00', 
                marginBottom: '20px', 
                textTransform: 'uppercase', 
                letterSpacing: '3px', 
                fontWeight: '800',
                textShadow: '3px 3px 10px rgba(0,0,0,0.9)' 
            }}>
                Ride, Explore, Discover Together
            </h1>
            
            <p style={{ 
                fontSize: '22px', 
                color: '#f0f0f0', 
                maxWidth: '800px', 
                lineHeight: '1.6', 
                marginBottom: '50px', 
                textShadow: '2px 2px 6px rgba(0,0,0,0.9)' 
            }}>
                Welcome to the ultimate brotherhood of passionate riders. Join our community rides, conquer thrilling terrains, and create unforgettable memories on the road.
            </p>
            
            {/* Buttons Section (Extra Large & Stylish) */}
            <div style={{ display: 'flex', gap: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Link to="/join" style={{ 
                    backgroundColor: '#ffcc00', 
                    color: '#000', 
                    padding: '20px 48px', 
                    borderRadius: '10px', 
                    fontWeight: '800', 
                    textDecoration: 'none', 
                    fontSize: '20px', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    boxShadow: '0 6px 20px rgba(255, 204, 0, 0.5)',
                    transition: 'transform 0.2s ease-in-out'
                }}>
                    Join Community Now
                </Link>
                
                <Link to="/events" style={{ 
                    border: '3px solid #ffcc00', 
                    color: '#ffcc00', 
                    padding: '20px 48px', 
                    borderRadius: '10px', 
                    fontWeight: '800', 
                    textDecoration: 'none', 
                    fontSize: '20px', 
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.8)',
                    transition: 'transform 0.2s ease-in-out'
                }}>
                    Upcoming Rides
                </Link>
            </div>
        </div>
    );
}