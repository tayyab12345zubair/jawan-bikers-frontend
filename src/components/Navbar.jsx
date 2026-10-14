import React from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    return (
        <nav style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            padding: '18px 45px', 
            backgroundColor: '#111', 
            color: '#fff',
            borderBottom: '2px solid #222',
            position: 'sticky',
            top: 0,
            zIndex: 1000
        }}>
            {/* Logo Section */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <img 
                    src={process.env.PUBLIC_URL + '/1.jpeg'} 
                    alt="Jawan Bikers Logo" 
                    onError={(e) => {
                        // Agar 1.jpeg na mile toh 1.jpg try karein, warna fallback icon dikhayein
                        if (!e.target.dataset.triedJpg) {
                            e.target.dataset.triedJpg = 'true';
                            e.target.src = process.env.PUBLIC_URL + '/1.jpg';
                        } else {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/65/ffcc00/000000?text=JB';
                        }
                    }}
                    style={{ 
                        width: '65px', 
                        height: '65px', 
                        borderRadius: '50%', 
                        objectFit: 'cover',
                        border: '3px solid #ffcc00',
                        boxShadow: '0 0 15px rgba(255,204,0,0.6)'
                    }} 
                />
                <span style={{ fontSize: '26px', fontWeight: '800', color: '#ffcc00', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
                    JAWAN BIKERS
                </span>
            </div>
            
            {/* Navigation Links */}
            <div style={{ display: 'flex', gap: '25px', alignItems: 'center' }}>
                <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>Home</Link>
                <Link to="/about" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>About Us</Link>
                <Link to="/events" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>Events</Link>
                <Link to="/gallery" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>Gallery</Link>
                <Link to="/blogs" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>Blogs</Link>
                <Link to="/team" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>Our Team</Link>
                <Link to="/contact" style={{ color: '#fff', textDecoration: 'none', fontWeight: '600', fontSize: '16px' }}>Contact</Link>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                <Link to="/join" style={{ 
                    backgroundColor: '#ffcc00', 
                    color: '#000', 
                    padding: '10px 20px', 
                    borderRadius: '8px', 
                    textDecoration: 'none', 
                    fontWeight: 'bold',
                    fontSize: '15px'
                }}>
                    Join Now
                </Link>
                <Link to="/profile" style={{ 
                    border: '2px solid #ffcc00', 
                    color: '#ffcc00', 
                    padding: '8px 18px', 
                    borderRadius: '8px', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    fontSize: '15px'
                }}>
                    Profile
                </Link>
                <Link to="/admin" style={{ 
                    backgroundColor: '#222', 
                    color: '#ffcc00', 
                    padding: '8px 16px', 
                    borderRadius: '8px', 
                    textDecoration: 'none', 
                    fontWeight: '600',
                    fontSize: '14px',
                    border: '1px solid #ffcc00'
                }}>
                    🛡️ Admin
                </Link>
            </div>
        </nav>
    );
}
