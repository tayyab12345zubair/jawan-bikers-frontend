import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

export default function Admin() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [adminCreds, setAdminCreds] = useState({ username: '', password: '' });
    const [activeTab, setActiveTab] = useState('rides');

    const [allRides, setAllRides] = useState([]);
    const [membersData, setMembersData] = useState([]);
    const [vaultData, setVaultData] = useState({});
    const [galleryData, setGalleryData] = useState([]);
    const [teamData, setTeamData] = useState([]);
    const [blogsData, setBlogsData] = useState([]);

    // Vault Inspection Modal State
    const [inspectingMember, setInspectingMember] = useState(null);

    const [newRide, setNewRide] = useState({ title: '', destination: '', meetupLocation: '', date: '', description: '', distanceKm: '', gpxRouteUrl: '' });
    const [newTeam, setNewTeam] = useState({ name: '', role: '', description: '', pictureUrl: '' });
    const [newBlog, setNewBlog] = useState({ title: '', content: '' });
    const [editingBlogId, setEditingBlogId] = useState(null);
    const [newGallery, setNewGallery] = useState({ title: '', imageUrl: '' });

    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showModal = (title, message, type = 'info') => {
        setModal({ isOpen: true, title, message, type });
    };

    const fetchAdminData = () => {
        axios.get('https://jawan-bikers-backend.vercel.app/api/upcoming-rides').then(res1 => {
            axios.get('https://jawan-bikers-backend.vercel.app/api/previous-tours').then(res2 => setAllRides([...res1.data, ...res2.data]));
        });
        axios.get('https://jawan-bikers-backend.vercel.app/api/admin/members').then(res => {
            setMembersData(res.data.members || []);
            setVaultData(res.data.vaultDocuments || {});
        });
        axios.get('https://jawan-bikers-backend.vercel.app/api/gallery').then(res => setGalleryData(res.data));
        axios.get('https://jawan-bikers-backend.vercel.app/api/team').then(res => setTeamData(res.data));
        axios.get('https://jawan-bikers-backend.vercel.app/api/blogs').then(res => setBlogsData(res.data));
    };

   const handleAdminLogin = async (e) => {
    e.preventDefault();

    // 🚀 Direct Verification for Admin
    if (adminCreds.username === 'admin' && adminCreds.password === 'admin123') {
        localStorage.setItem('jb_admin', 'true');
        setIsAdminLoggedIn(true); // ya jo bhi aapki admin state/navigation hai
        showModal('Success', 'Admin Login Successful!', 'success');
        return;
    }

    try {
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/login', adminCreds);
        if (res.data.success) {
            localStorage.setItem('jb_admin', 'true');
            setIsAdminLoggedIn(true);
            showModal('Success', 'Admin Login Successful!', 'success');
        }
    } catch (err) {
        showModal('Access Denied', 'Invalid Username or Password.', 'error');
    }
};

    const handleCreateRide = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/rides/create', newRide);
            showModal('Success', 'Upcoming ride created with Meetup Location & KM!', 'success');
            setNewRide({ title: '', destination: '', meetupLocation: '', date: '', description: '', distanceKm: '', gpxRouteUrl: '' });
            fetchAdminData();
        } catch (err) { showModal('Error', 'Could not create ride.', 'error'); }
    };

    const handleToggleRideStatus = async (rideId) => {
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/rides/toggle-status', { rideId });
        showModal('Updated', res.data.message, 'success');
        fetchAdminData();
    };

    const handleDeleteRide = async (rideId) => {
        if (!window.confirm('Delete this ride permanently?')) return;
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/rides/delete', { rideId });
        showModal('Deleted', res.data.message, 'success');
        fetchAdminData();
    };

    const handleDeleteMember = async (email) => {
        if (!window.confirm(`Delete member ${email}?`)) return;
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/members/delete', { email });
        setMembersData(res.data.members || []);
        setVaultData(res.data.vaultDocuments || {});
        showModal('Deleted', 'Member removed successfully.', 'success');
    };

    const handleAddGallery = async (e) => {
        e.preventDefault();
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/gallery/add', newGallery);
        setGalleryData(res.data.gallery || []);
        setNewGallery({ title: '', imageUrl: '' });
        showModal('Success', 'Photo added to gallery.', 'success');
    };

    const handleDeleteGallery = async (id) => {
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/gallery/delete', { id });
        setGalleryData(res.data.gallery || []);
        showModal('Deleted', 'Photo removed.', 'success');
    };

    const handleAddTeam = async (e) => {
        e.preventDefault();
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/team/add', newTeam);
        setTeamData(res.data.team || []);
        setNewTeam({ name: '', role: '', description: '', pictureUrl: '' });
        showModal('Success', 'Team member added.', 'success');
    };

    const handleDeleteTeam = async (id) => {
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/team/delete', { id });
        setTeamData(res.data.team || []);
        showModal('Deleted', 'Team member removed.', 'success');
    };

    const handleSaveBlog = async (e) => {
        e.preventDefault();
        if (editingBlogId) {
            const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/blogs/update', { id: editingBlogId, ...newBlog });
            setBlogsData(res.data.blogs || []);
            setEditingBlogId(null);
            showModal('Updated', 'Blog updated successfully.', 'success');
        } else {
            const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/blogs/create', newBlog);
            setBlogsData(res.data.blogs || []);
            showModal('Published', 'New blog published.', 'success');
        }
        setNewBlog({ title: '', content: '' });
    };

    const handleEditBlogBtn = (blog) => {
        setEditingBlogId(blog._id);
        setNewBlog({ title: blog.title, content: blog.content });
    };

    const handleDeleteBlog = async (id) => {
        const res = await axios.post('https://jawan-bikers-backend.vercel.app/api/admin/blogs/delete', { id });
        setBlogsData(res.data.blogs || []);
        showModal('Deleted', 'Blog removed.', 'success');
    };

    return (
        <div style={{ color: '#fff', paddingBottom: '70px' }}>
            <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />

            {/* Member Inspection Modal */}
            {inspectingMember && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#1c1c1c', border: '2px solid #ffcc00', borderRadius: '14px', padding: '30px', width: '100%', maxWidth: '650px', maxHeight: '85vh', overflowY: 'auto' }}>
                        <h2 style={{ color: '#ffcc00', marginTop: 0 }}>🔍 Member Inspection: {inspectingMember.fullName}</h2>
                        
                        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <h4 style={{ color: '#ffcc00', margin: '0 0 8px 0' }}>📋 Contact & Personal Info</h4>
                            <p style={{ margin: '4px 0' }}><b>Email:</b> {inspectingMember.email}</p>
                            <p style={{ margin: '4px 0' }}><b>Mobile:</b> {inspectingMember.mobileNumber}</p>
                            <p style={{ margin: '4px 0' }}><b>Address:</b> {inspectingMember.address}</p>
                        </div>

                        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <h4 style={{ color: '#ffcc00', margin: '0 0 8px 0' }}>🚨 Emergency Contact</h4>
                            <p style={{ margin: '4px 0' }}><b>Name:</b> {inspectingMember.emergencyContact?.name || 'Not Provided'}</p>
                            <p style={{ margin: '4px 0' }}><b>Relation:</b> {inspectingMember.emergencyContact?.relation || 'N/A'}</p>
                            <p style={{ margin: '4px 0' }}><b>Phone:</b> {inspectingMember.emergencyContact?.phone || 'N/A'}</p>
                        </div>

                        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                            <h4 style={{ color: '#ffcc00', margin: '0 0 8px 0' }}>🏍️ Garage Info</h4>
                            <p style={{ margin: '4px 0' }}><b>Primary Bike:</b> {inspectingMember.primaryBike?.manufacturer} {inspectingMember.primaryBike?.modelName} ({inspectingMember.primaryBike?.plateNumber})</p>
                            {inspectingMember.secondaryBike?.modelName && (
                                <p style={{ margin: '4px 0' }}><b>Secondary Bike:</b> {inspectingMember.secondaryBike?.manufacturer} {inspectingMember.secondaryBike?.modelName} ({inspectingMember.secondaryBike?.plateNumber})</p>
                            )}
                        </div>

                        <div style={{ background: '#252525', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
                            <h4 style={{ color: '#ffcc00', margin: '0 0 8px 0' }}>📂 Digital Vault Documents</h4>
                            {(!vaultData[inspectingMember.email] || vaultData[inspectingMember.email].length === 0) ? (
                                <p style={{ color: '#aaa', fontSize: '13px' }}>No documents uploaded in vault.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {vaultData[inspectingMember.email].map((doc, idx) => (
                                        <div key={idx} style={{ background: '#333', padding: '10px', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <p style={{ margin: 0, fontWeight: 'bold', color: '#fff' }}>{doc.docName} ({doc.docType})</p>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>Uploaded: {doc.uploadDate}</p>
                                            </div>
                                            <a href={doc.fileData} target="_blank" rel="noreferrer" style={{ background: '#ffcc00', color: '#000', padding: '6px 12px', borderRadius: '4px', textDecoration: 'none', fontSize: '12px', fontWeight: 'bold' }}>View File 👁️</a>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <button onClick={() => setInspectingMember(null)} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', width: '100%' }}>Close Inspection</button>
                    </div>
                </div>
            )}

            {!isAdmin ? (
                <div style={{ maxWidth: '450px', margin: '80px auto', padding: '0 20px' }}>
                    <div style={{ background: '#161616', border: '2px solid #ffcc00', borderRadius: '16px', padding: '40px', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.9)' }}>
                        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🛡️</div>
                        <h2 style={{ color: '#ffcc00', textTransform: 'uppercase', marginBottom: '10px' }}>Admin Control Portal</h2>
                        <p style={{ color: '#ccc', fontSize: '14px', marginBottom: '25px' }}>Credentials: <b>admin</b> / <b>admin123</b></p>
                        <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="text" placeholder="Username" value={adminCreds.username} onChange={(e) => setAdminCreds({ ...adminCreds, username: e.target.value })} required style={{ padding: '12px' }} />
                            <input type="password" placeholder="Password" value={adminCreds.password} onChange={(e) => setAdminCreds({ ...adminCreds, password: e.target.value })} required style={{ padding: '12px' }} />
                            <button type="submit" style={{ backgroundColor: '#ffcc00', color: '#000', padding: '14px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}>Login</button>
                        </form>
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', minHeight: '85vh', maxWidth: '1300px', margin: '30px auto', gap: '25px', padding: '0 20px' }}>
                    <div style={{ width: '260px', background: '#161616', border: '1px solid #333', borderRadius: '14px', padding: '20px', height: 'fit-content' }}>
                        <h3 style={{ color: '#ffcc00', borderBottom: '1px solid #333', paddingBottom: '12px', marginTop: 0 }}>⚙️ Admin Menu</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '15px' }}>
                            <button onClick={() => setActiveTab('rides')} style={{ padding: '12px', textAlign: 'left', background: activeTab === 'rides' ? '#ffcc00' : 'transparent', color: activeTab === 'rides' ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🚀 Manage Rides</button>
                            <button onClick={() => setActiveTab('gallery')} style={{ padding: '12px', textAlign: 'left', background: activeTab === 'gallery' ? '#ffcc00' : 'transparent', color: activeTab === 'gallery' ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>📷 Ride Gallery</button>
                            <button onClick={() => setActiveTab('team')} style={{ padding: '12px', textAlign: 'left', background: activeTab === 'team' ? '#ffcc00' : 'transparent', color: activeTab === 'team' ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>👥 Team Members</button>
                            <button onClick={() => setActiveTab('blogs')} style={{ padding: '12px', textAlign: 'left', background: activeTab === 'blogs' ? '#ffcc00' : 'transparent', color: activeTab === 'blogs' ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>✍️ Biker Blogs</button>
                            <button onClick={() => setActiveTab('members')} style={{ padding: '12px', textAlign: 'left', background: activeTab === 'members' ? '#ffcc00' : 'transparent', color: activeTab === 'members' ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>📋 Registered Members</button>
                            <button onClick={() => setIsAdmin(false)} style={{ marginTop: '20px', padding: '12px', textAlign: 'left', background: '#cc0000', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>🚪 Exit Admin</button>
                        </div>
                    </div>

                    <div style={{ flex: 1, background: '#161616', border: '1px solid #333', borderRadius: '14px', padding: '30px' }}>
                        {activeTab === 'rides' && (
                            <div>
                                <h2 style={{ color: '#ffcc00', marginTop: 0 }}>🚀 Create & Manage Rides</h2>
                                <form onSubmit={handleCreateRide} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                    <input type="text" placeholder="Ride Title" value={newRide.title} onChange={(e) => setNewRide({ ...newRide, title: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="text" placeholder="Destination" value={newRide.destination} onChange={(e) => setNewRide({ ...newRide, destination: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="text" placeholder="Meetup Location (e.g. HBL Metroville)" value={newRide.meetupLocation} onChange={(e) => setNewRide({ ...newRide, meetupLocation: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="date" value={newRide.date} onChange={(e) => setNewRide({ ...newRide, date: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="number" placeholder="Distance in KM (e.g. 150)" value={newRide.distanceKm} onChange={(e) => setNewRide({ ...newRide, distanceKm: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="text" placeholder="Route Map URL (Optional)" value={newRide.gpxRouteUrl} onChange={(e) => setNewRide({ ...newRide, gpxRouteUrl: e.target.value })} style={{ padding: '10px' }} />
                                    <textarea placeholder="Description" value={newRide.description} onChange={(e) => setNewRide({ ...newRide, description: e.target.value })} required style={{ padding: '10px', gridColumn: '1 / -1' }} />
                                    <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#ffcc00', color: '#000', padding: '12px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', textTransform: 'uppercase' }}>Publish Ride Event</button>
                                </form>

                                <h3 style={{ color: '#fff', borderBottom: '1px solid #333', paddingBottom: '8px' }}>Existing Rides</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {allRides.map(ride => (
                                        <div key={ride._id} style={{ background: '#222', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                            <div>
                                                <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{ride.title} ({ride.distanceKm || 150} KM)</h4>
                                                <p style={{ color: '#ffcc00', margin: '2px 0', fontSize: '13px' }}>📍 Dest: {ride.destination} | 🚩 Meetup: {ride.meetupLocation || 'Main Point'}</p>
                                                <p style={{ color: '#aaa', margin: '2px 0', fontSize: '12px' }}>Status: {ride.status.toUpperCase()}</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleToggleRideStatus(ride._id)} style={{ backgroundColor: ride.status === 'upcoming' ? '#28a745' : '#17a2b8', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                                    {ride.status === 'upcoming' ? 'Mark Completed ✅' : 'Re-open 🚀'}
                                                </button>
                                                <button onClick={() => handleDeleteRide(ride._id)} style={{ backgroundColor: '#cc0000', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                                                    Delete 🗑️
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div>
                                <h2 style={{ color: '#ffcc00', marginTop: 0 }}>📷 Ride Gallery Photos</h2>
                                <form onSubmit={handleAddGallery} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                    <input type="text" placeholder="Photo Title" value={newGallery.title} onChange={(e) => setNewGallery({ ...newGallery, title: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="text" placeholder="Image URL" value={newGallery.imageUrl} onChange={(e) => setNewGallery({ ...newGallery, imageUrl: e.target.value })} required style={{ padding: '10px' }} />
                                    <button type="submit" style={{ backgroundColor: '#ffcc00', color: '#000', padding: '10px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Photo</button>
                                </form>

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '15px' }}>
                                    {galleryData.map(img => (
                                        <div key={img._id} style={{ background: '#222', padding: '10px', borderRadius: '8px', textAlign: 'center' }}>
                                            <img src={img.imageUrl} alt={img.title} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '6px', marginBottom: '8px' }} />
                                            <p style={{ color: '#fff', fontSize: '13px', margin: '0 0 8px 0' }}>{img.title}</p>
                                            <button onClick={() => handleDeleteGallery(img._id)} style={{ backgroundColor: '#cc0000', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer' }}>Delete</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'team' && (
                            <div>
                                <h2 style={{ color: '#ffcc00', marginTop: 0 }}>👥 Team Members Management</h2>
                                <form onSubmit={handleAddTeam} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
                                    <input type="text" placeholder="Full Name" value={newTeam.name} onChange={(e) => setNewTeam({ ...newTeam, name: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="text" placeholder="Role (e.g. Lead Captain)" value={newTeam.role} onChange={(e) => setNewTeam({ ...newTeam, role: e.target.value })} required style={{ padding: '10px' }} />
                                    <input type="text" placeholder="Photo URL" value={newTeam.pictureUrl} onChange={(e) => setNewTeam({ ...newTeam, pictureUrl: e.target.value })} style={{ padding: '10px' }} />
                                    <textarea placeholder="Description" value={newTeam.description} onChange={(e) => setNewTeam({ ...newTeam, description: e.target.value })} required style={{ padding: '10px', gridColumn: '1 / -1' }} />
                                    <button type="submit" style={{ gridColumn: '1 / -1', backgroundColor: '#ffcc00', color: '#000', padding: '10px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Add Team Member</button>
                                </form>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {teamData.map(member => (
                                        <div key={member._id} style={{ background: '#222', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{member.name} - <span style={{ color: '#ffcc00' }}>{member.role}</span></h4>
                                                <p style={{ color: '#aaa', margin: 0, fontSize: '13px' }}>{member.description}</p>
                                            </div>
                                            <button onClick={() => handleDeleteTeam(member._id)} style={{ backgroundColor: '#cc0000', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Delete 🗑️</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'blogs' && (
                            <div>
                                <h2 style={{ color: '#ffcc00', marginTop: 0 }}>✍️ {editingBlogId ? 'Edit Blog Article' : 'Publish Blog Article'}</h2>
                                <form onSubmit={handleSaveBlog} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                                    <input type="text" placeholder="Blog Title" value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} required style={{ padding: '10px' }} />
                                    <textarea placeholder="Blog Content..." value={newBlog.content} onChange={(e) => setNewBlog({ ...newBlog, content: e.target.value })} required style={{ padding: '10px', height: '100px' }} />
                                    <div style={{ display: 'flex', gap: '10px' }}>
                                        <button type="submit" style={{ backgroundColor: '#ffcc00', color: '#000', padding: '10px 20px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{editingBlogId ? 'Update Blog' : 'Publish Blog'}</button>
                                        {editingBlogId && <button type="button" onClick={() => { setEditingBlogId(null); setNewBlog({ title: '', content: '' }); }} style={{ backgroundColor: '#444', color: '#fff', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>}
                                    </div>
                                </form>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {blogsData.map(blog => (
                                        <div key={blog._id} style={{ background: '#222', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{blog.title}</h4>
                                                <p style={{ color: '#aaa', margin: 0, fontSize: '13px' }}>{blog.content.substring(0, 80)}...</p>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button onClick={() => handleEditBlogBtn(blog)} style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Edit ✏️</button>
                                                <button onClick={() => handleDeleteBlog(blog._id)} style={{ backgroundColor: '#cc0000', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>Delete 🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div>
                                <h2 style={{ color: '#ffcc00', marginTop: 0 }}>📋 Registered Members List ({membersData.length})</h2>
                                {membersData.length === 0 ? (
                                    <p style={{ color: '#888' }}>No members registered yet.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                        {membersData.map((m, idx) => (
                                            <div key={idx} style={{ background: '#222', padding: '20px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                                                <div>
                                                    <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{m.fullName} ({m.email})</h4>
                                                    <p style={{ color: '#aaa', margin: '3px 0', fontSize: '14px' }}>📞 {m.mobileNumber} | 🏠 {m.address}</p>
                                                    <p style={{ color: '#ffcc00', margin: '3px 0', fontSize: '14px' }}>🏍️ Bike: {m.primaryBike?.manufacturer} {m.primaryBike?.modelName} ({m.primaryBike?.plateNumber})</p>
                                                </div>
                                                <div style={{ display: 'flex', gap: '10px' }}>
                                                    <button onClick={() => setInspectingMember(m)} style={{ backgroundColor: '#17a2b8', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Inspect Vault & Emergency 📂</button>
                                                    <button onClick={() => handleDeleteMember(m.email)} style={{ backgroundColor: '#cc0000', color: '#fff', border: 'none', padding: '8px 14px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px' }}>Delete 🗑️</button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                    </div>
                </div>
            )}
        </div>
    );
}