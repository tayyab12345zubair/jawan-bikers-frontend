import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Blogs() {
    const [blogs, setBlogs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedBlog, setSelectedBlog] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/blogs')
            .then(res => setBlogs(res.data))
            .catch(err => console.log(err));
    }, []);

    const filteredBlogs = blogs.filter(blog => 
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div style={{ color: '#fff', paddingBottom: '60px' }}>
            
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
                    Biker Blogs & Rider Stories
                </h1>
                <p style={{ 
                    fontSize: '18px', 
                    color: '#ccc', 
                    maxWidth: '700px', 
                    margin: '0 auto 30px auto', 
                    lineHeight: '1.6' 
                }}>
                    Tips, maintenance guides, tour logs, and stories from the highway written by passionate community riders.
                </p>

                {/* Search Bar */}
                <div style={{ maxWidth: '500px', margin: '0 auto' }}>
                    <input 
                        type="text" 
                        placeholder="🔍 Search blog posts or maintenance tips..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{ 
                            width: '100%', 
                            padding: '14px 20px', 
                            fontSize: '16px', 
                            borderRadius: '30px', 
                            border: '1px solid #444', 
                            boxSizing: 'border-box'
                        }}
                    />
                </div>
            </div>

            <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '50px 20px' }}>
                
                {/* 2. Blog Post Grid */}
                {filteredBlogs.length === 0 ? (
                    <div style={{ background: '#161616', padding: '40px', borderRadius: '12px', textAlign: 'center', color: '#888' }}>
                        No blog posts found matching your search.
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '30px' }}>
                        {filteredBlogs.map(blog => (
                            <div key={blog._id} style={{ 
                                background: '#161616', 
                                border: '1px solid #282828', 
                                borderRadius: '12px', 
                                padding: '28px', 
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'space-between',
                                boxShadow: '0 6px 20px rgba(0,0,0,0.5)',
                                transition: 'transform 0.2s'
                            }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                        <span style={{ 
                                            backgroundColor: 'rgba(255, 204, 0, 0.15)', 
                                            color: '#ffcc00', 
                                            padding: '4px 12px', 
                                            borderRadius: '15px', 
                                            fontSize: '12px', 
                                            fontWeight: 'bold',
                                            textTransform: 'uppercase'
                                        }}>
                                            Rider Guide
                                        </span>
                                        <span style={{ fontSize: '13px', color: '#777' }}>
                                            📅 {blog.date}
                                        </span>
                                    </div>

                                    <h3 style={{ color: '#fff', fontSize: '22px', margin: '10px 0 15px 0', lineHeight: '1.4' }}>
                                        {blog.title}
                                    </h3>

                                    <p style={{ color: '#aaa', fontSize: '15px', lineHeight: '1.6', marginBottom: '20px' }}>
                                        {blog.content.length > 120 ? blog.content.substring(0, 120) + '...' : blog.content}
                                    </p>
                                </div>

                                <button 
                                    onClick={() => setSelectedBlog(blog)}
                                    style={{ 
                                        backgroundColor: 'transparent', 
                                        color: '#ffcc00', 
                                        border: '1px solid #ffcc00', 
                                        padding: '10px 18px', 
                                        borderRadius: '6px', 
                                        fontWeight: 'bold', 
                                        cursor: 'pointer',
                                        fontSize: '14px',
                                        alignSelf: 'flex-start'
                                    }}
                                >
                                    Read Full Post →
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* 3. Read Full Blog Modal */}
                {selectedBlog && (
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
                        zIndex: 1000,
                        padding: '20px'
                    }}>
                        <div style={{ 
                            background: '#181818', 
                            border: '1px solid #ffcc00', 
                            borderRadius: '14px', 
                            padding: '35px', 
                            maxWidth: '650px', 
                            width: '100%', 
                            maxHeight: '80vh', 
                            overflowY: 'auto',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.9)'
                        }}>
                            <span style={{ fontSize: '13px', color: '#ffcc00', fontWeight: 'bold' }}>
                                Published on {selectedBlog.date}
                            </span>
                            <h2 style={{ color: '#fff', fontSize: '26px', margin: '10px 0 20px 0' }}>
                                {selectedBlog.title}
                            </h2>
                            <p style={{ color: '#ddd', fontSize: '16px', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                                {selectedBlog.content}
                            </p>
                            <button 
                                onClick={() => setSelectedBlog(null)}
                                style={{ 
                                    marginTop: '25px', 
                                    backgroundColor: '#ffcc00', 
                                    color: '#000', 
                                    padding: '10px 24px', 
                                    border: 'none', 
                                    borderRadius: '6px', 
                                    fontWeight: 'bold', 
                                    cursor: 'pointer',
                                    fontSize: '15px'
                                }}
                            >
                                Close Article
                            </button>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}