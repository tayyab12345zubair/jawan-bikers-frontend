import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Tours() {
    const [upcomingRides, setUpcomingRides] = useState([]);
    const [previousTours, setPreviousTours] = useState([]);
    const [activeMapUrl, setActiveMapUrl] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/upcoming-rides')
            .then(res => setUpcomingRides(res.data))
            .catch(err => console.log(err));

        axios.get('http://localhost:5000/api/previous-tours')
            .then(res => setPreviousTours(res.data))
            .catch(err => console.log(err));
    }, []);

    return (
        <div style={{ color: '#fff', padding: '40px 20px', maxWidth: '1100px', margin: '0 auto' }}>
            <h1 style={{ color: '#ffcc00', textAlign: 'center', textTransform: 'uppercase', marginBottom: '40px', fontSize: '38px' }}>
                🏍️ Jawan Bikers Events & Tours
            </h1>

            {/* UPCOMING RIDES */}
            <h2 style={{ color: '#ffcc00', borderBottom: '2px solid #333', paddingBottom: '10px', marginBottom: '25px' }}>
                🚀 Upcoming Rides & GPX Route Maps
            </h2>
            {upcomingRides.length === 0 ? (
                <p style={{ color: '#888' }}>No upcoming rides scheduled right now.</p>
            ) : (
                upcomingRides.map(ride => (
                    <div key={ride._id} style={{ background: '#161616', border: '1px solid #333', borderRadius: '14px', padding: '30px', marginBottom: '25px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ background: '#ffcc00', color: '#000', padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                                    DISTANCE: {ride.distanceKm || 150} KM
                                </span>
                                <h3 style={{ color: '#fff', fontSize: '24px', margin: '10px 0 5px 0' }}>{ride.title}</h3>
                                <p style={{ color: '#ffcc00', fontSize: '15px', margin: '4px 0' }}>📍 <b>Destination:</b> {ride.destination}</p>
                                <p style={{ color: '#ccc', fontSize: '15px', margin: '4px 0' }}>📅 <b>Date:</b> {ride.date}</p>
                                <p style={{ color: '#aaa', fontSize: '14px', marginTop: '10px' }}>{ride.description}</p>
                            </div>

                            {/* GPX Map Preview Button */}
                            <div style={{ minWidth: '250px', textAlign: 'center' }}>
                                <button 
                                    onClick={() => setActiveMapUrl(activeMapUrl === ride._id ? null : ride._id)}
                                    style={{ backgroundColor: '#222', color: '#ffcc00', border: '2px solid #ffcc00', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}
                                >
                                    {activeMapUrl === ride._id ? 'Hide Route Map 🗺️' : 'View GPX Route & Elevation 🗺️'}
                                </button>
                            </div>
                        </div>

                        {/* Embedded Route Map Viewer */}
                        {activeMapUrl === ride._id && (
                            <div style={{ marginTop: '20px', borderTop: '1px solid #333', paddingTop: '20px' }}>
                                <h4 style={{ color: '#ffcc00', margin: '0 0 10px 0' }}>🗺️ Interactive Elevation & Track Map</h4>
                                <iframe 
                                    title="Route Map"
                                    width="100%" 
                                    height="300" 
                                    frameBorder="0" 
                                    scrolling="no" 
                                    marginHeight="0" 
                                    marginWidth="0" 
                                    src={ride.gpxRouteUrl}
                                    style={{ borderRadius: '10px', border: '1px solid #444' }}
                                ></iframe>
                            </div>
                        )}
                    </div>
                ))
            )}

            {/* PREVIOUS TOURS */}
            <h2 style={{ color: '#ffcc00', borderBottom: '2px solid #333', paddingBottom: '10px', margin: '50px 0 25px 0' }}>
                🏆 Completed Previous Tours & Archives
            </h2>
            {previousTours.length === 0 ? (
                <p style={{ color: '#888' }}>No completed tours in archives yet.</p>
            ) : (
                previousTours.map(tour => (
                    <div key={tour._id} style={{ background: '#161616', border: '1px solid #333', borderRadius: '14px', padding: '25px', marginBottom: '20px' }}>
                        <h3 style={{ color: '#fff', fontSize: '20px', margin: '0 0 5px 0' }}>{tour.title}</h3>
                        <p style={{ color: '#ffcc00', margin: '3px 0' }}>📍 {tour.destination} | 📅 {tour.date}</p>
                        <p style={{ color: '#aaa', fontSize: '14px' }}>{tour.description}</p>
                    </div>
                ))
            )}
        </div>
    );
}