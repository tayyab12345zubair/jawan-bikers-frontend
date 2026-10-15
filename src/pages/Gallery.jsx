import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Gallery() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        axios.get('https://jawan-bikers-backend.vercel.app/api/gallery')
            .then(res => setImages(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
            <h2 style={{ color: '#ffcc00', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '25px' }}>📸 Ride Gallery</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
                {images.map(img => (
                    <div key={img._id} style={{ background: '#181818', border: '1px solid #333', borderRadius: '10px', overflow: 'hidden', padding: '10px' }}>
                        <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '180px', objectFit: 'cover', borderRadius: '6px' }} />
                        <h4 style={{ color: '#fff', textAlign: 'center', marginTop: '10px' }}>{img.title}</h4>
                    </div>
                ))}
            </div>
        </div>
    );
}