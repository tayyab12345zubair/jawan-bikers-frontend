import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

export default function Profile() {
    const [member, setMember] = useState(null);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [forgotStep, setForgotStep] = useState(1);
    const [forgotEmail, setForgotEmail] = useState('');
    const [otpCode, setOtpCode] = useState('');
    const [recoveredPassword, setRecoveredPassword] = useState('');

    const [loginData, setLoginData] = useState({ email: '', password: '' });
    const [vaultDocs, setVaultDocs] = useState([]);
    const [docType, setDocType] = useState('CNIC');
    const [docName, setDocName] = useState('');
    const [fileData, setFileData] = useState('');
    const [upcomingRides, setUpcomingRides] = useState([]);
    const [leaderboard, setLeaderboard] = useState([]);
    const [myStats, setMyStats] = useState({ totalTours: 0, totalKm: 0, badges: ['New Rider 🏍️'] });

    // Modals for Editing
    const [showEmergencyModal, setShowEmergencyModal] = useState(false);
    const [emergencyForm, setEmergencyForm] = useState({ name: '', relation: '', phone: '' });

    const [showGarageModal, setShowGarageModal] = useState(false);
    const [garageForm, setGarageForm] = useState({
        primaryBike: { manufacturer: '', modelName: '', plateNumber: '' },
        secondaryBike: { manufacturer: '', modelName: '', plateNumber: '' }
    });

    // Safety Checklist Modal State
    const [selectedRideForChecklist, setSelectedRideForChecklist] = useState(null);
    const [checklist, setChecklist] = useState({
        gear: false,
        brakes: false,
        tires: false,
        fluids: false,
        vault: false,
        emergency: false
    });

    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const showModal = (title, message, type = 'info') => {
        setModal({ isOpen: true, title, message, type });
    };

    useEffect(() => {
        const savedMember = localStorage.getItem('jb_member');
        if (savedMember) {
            const parsed = JSON.parse(savedMember);
            setMember(parsed);
            fetchVault(parsed.email);
        }
        fetchRidesAndLeaderboard();
    }, []);

    const fetchVault = (email) => {
        axios.get(`http://localhost:5000/api/vault/${email}`).then(res => setVaultDocs(res.data));
    };

    const fetchRidesAndLeaderboard = () => {
        axios.get('http://localhost:5000/api/upcoming-rides').then(res => setUpcomingRides(res.data));
        axios.get('http://localhost:5000/api/leaderboard').then(res => {
            setLeaderboard(res.data);
            const currentMember = localStorage.getItem('jb_member');
            if (currentMember) {
                const parsed = JSON.parse(currentMember);
                const found = res.data.find(r => r.email === parsed.email);
                if (found) {
                    setMyStats({ totalTours: found.totalTours, totalKm: found.totalKm, badges: found.badges });
                }
            }
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/members/login', loginData);
            setMember(res.data.member);
            localStorage.setItem('jb_member', JSON.stringify(res.data.member));
            fetchVault(res.data.member.email);
            fetchRidesAndLeaderboard();
            showModal('Welcome Back!', 'Login successful.', 'success');
        } catch (err) {
            showModal('Login Failed', err.response?.data?.error || 'Invalid credentials', 'error');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('jb_member');
        setMember(null);
        showModal('Logged Out', 'You have been successfully logged out.', 'info');
    };

    // Emergency Contact Handlers
    const openEmergencyModal = () => {
        setEmergencyForm(member.emergencyContact || { name: '', relation: '', phone: '' });
        setShowEmergencyModal(true);
    };

    const handleSaveEmergency = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/members/update-emergency', {
                email: member.email,
                emergencyContact: emergencyForm
            });
            setMember(res.data.member);
            localStorage.setItem('jb_member', JSON.stringify(res.data.member));
            setShowEmergencyModal(false);
            showModal('Success', 'Emergency contact updated successfully!', 'success');
        } catch (err) {
            showModal('Error', 'Failed to update emergency contact.', 'error');
        }
    };

    // Garage Handlers
    const openGarageModal = () => {
        setGarageForm({
            primaryBike: member.primaryBike || { manufacturer: '', modelName: '', plateNumber: '' },
            secondaryBike: member.secondaryBike || { manufacturer: '', modelName: '', plateNumber: '' }
        });
        setShowGarageModal(true);
    };

    const handleSaveGarage = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/members/update-garage', {
                email: member.email,
                primaryBike: garageForm.primaryBike,
                secondaryBike: garageForm.secondaryBike
            });
            setMember(res.data.member);
            localStorage.setItem('jb_member', JSON.stringify(res.data.member));
            setShowGarageModal(false);
            showModal('Success', 'Garage details updated successfully!', 'success');
        } catch (err) {
            showModal('Error', 'Failed to update garage details.', 'error');
        }
    };

    const handleRemoveSecondaryBike = async () => {
        try {
            const res = await axios.post('http://localhost:5000/api/members/update-garage', {
                email: member.email,
                primaryBike: member.primaryBike,
                secondaryBike: { manufacturer: '', modelName: '', plateNumber: '' }
            });
            setMember(res.data.member);
            localStorage.setItem('jb_member', JSON.stringify(res.data.member));
            setShowGarageModal(false);
            showModal('Updated', 'Secondary bike removed from garage.', 'success');
        } catch (err) {
            showModal('Error', 'Failed to remove secondary bike.', 'error');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setFileData(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const submitVaultDoc = async (e) => {
        e.preventDefault();
        if (!fileData) return showModal('Error', 'Please select a file to upload.', 'error');
        try {
            const res = await axios.post('http://localhost:5000/api/vault/upload', {
                userEmail: member.email,
                docType,
                docName: docName || docType,
                fileData
            });
            setVaultDocs(res.data.documents);
            setDocName('');
            setFileData('');
            showModal('Success', 'Document uploaded securely to vault!', 'success');
        } catch (err) {
            showModal('Error', 'Upload failed.', 'error');
        }
    };

    // Checklist Trigger & Registration Finalization
    const handleOpenChecklist = (ride) => {
        setSelectedRideForChecklist(ride);
        setChecklist({ gear: false, brakes: false, tires: false, fluids: false, vault: false, emergency: false });
    };

    const handleFinalizeRideRegistration = async () => {
        const allChecked = Object.values(checklist).every(Boolean);
        if (!allChecked) {
            return showModal('Checklist Incomplete', 'Please confirm all 6 safety items before registering.', 'error');
        }

        try {
            const res = await axios.post('http://localhost:5000/api/rides/register', { rideId: selectedRideForChecklist._id, userEmail: member.email });
            showModal('Ride Registered!', res.data.message, 'success');
            setSelectedRideForChecklist(null);
            fetchRidesAndLeaderboard();
        } catch (err) {
            showModal('Notice', err.response?.data?.error || 'Already registered', 'info');
        }
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '40px auto', padding: '0 20px', color: '#fff' }}>
            <Modal isOpen={modal.isOpen} onClose={() => setModal({ ...modal, isOpen: false })} title={modal.title} message={modal.message} type={modal.type} />

            {/* Pre-Ride Safety Checklist Modal */}
            {selectedRideForChecklist && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#1c1c1c', border: '2px solid #ffcc00', borderRadius: '14px', padding: '30px', width: '100%', maxWidth: '500px' }}>
                        <h3 style={{ color: '#ffcc00', marginTop: 0 }}>⚠️ Mandatory Pre-Ride Safety Checklist</h3>
                        <p style={{ color: '#aaa', fontSize: '13px' }}>Ride: <b>{selectedRideForChecklist.title}</b></p>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '20px 0' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={checklist.gear} onChange={(e) => setChecklist({ ...checklist, gear: e.target.checked })} />
                                <span>🪖 Helmet & Full Safety Gear Ready</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={checklist.brakes} onChange={(e) => setChecklist({ ...checklist, brakes: e.target.checked })} />
                                <span>🔧 Brakes, Clutch & Chain Checked</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={checklist.tires} onChange={(e) => setChecklist({ ...checklist, tires: e.target.checked })} />
                                <span>🛞 Tire Pressure & Puncture Kit Ready</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={checklist.fluids} onChange={(e) => setChecklist({ ...checklist, fluids: e.target.checked })} />
                                <span>🛢️ Engine Oil & Fuel Level Checked</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={checklist.vault} onChange={(e) => setChecklist({ ...checklist, vault: e.target.checked })} />
                                <span>📂 CNIC & Bike Papers in Vault</span>
                            </label>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#252525', padding: '10px', borderRadius: '6px', cursor: 'pointer' }}>
                                <input type="checkbox" checked={checklist.emergency} onChange={(e) => setChecklist({ ...checklist, emergency: e.target.checked })} />
                                <span>🚨 Emergency Contact Details Up-to-Date</span>
                            </label>
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button onClick={handleFinalizeRideRegistration} style={{ flex: 1, background: '#ffcc00', color: '#000', padding: '12px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Confirm & Register 🏍️</button>
                            <button onClick={() => setSelectedRideForChecklist(null)} style={{ background: '#444', color: '#fff', padding: '12px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Emergency Contact Modal */}
            {showEmergencyModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#1c1c1c', border: '2px solid #ffcc00', borderRadius: '14px', padding: '30px', width: '100%', maxWidth: '450px' }}>
                        <h3 style={{ color: '#ffcc00', marginTop: 0 }}>🚨 Edit Emergency Contact</h3>
                        <form onSubmit={handleSaveEmergency} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <input type="text" placeholder="Contact Person Name" value={emergencyForm.name} onChange={(e) => setEmergencyForm({ ...emergencyForm, name: e.target.value })} required style={{ padding: '10px' }} />
                            <input type="text" placeholder="Relation (e.g. Brother)" value={emergencyForm.relation} onChange={(e) => setEmergencyForm({ ...emergencyForm, relation: e.target.value })} required style={{ padding: '10px' }} />
                            <input type="text" placeholder="Phone Number" value={emergencyForm.phone} onChange={(e) => setEmergencyForm({ ...emergencyForm, phone: e.target.value })} required style={{ padding: '10px' }} />
                            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                                <button type="submit" style={{ flex: 1, background: '#ffcc00', color: '#000', padding: '10px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Changes</button>
                                <button type="button" onClick={() => setShowEmergencyModal(false)} style={{ flex: 1, background: '#444', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Garage Edit Modal */}
            {showGarageModal && (
                <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.85)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px' }}>
                    <div style={{ background: '#1c1c1c', border: '2px solid #ffcc00', borderRadius: '14px', padding: '30px', width: '100%', maxWidth: '550px', maxHeight: '85vh', overflowY: 'auto' }}>
                        <h3 style={{ color: '#ffcc00', marginTop: 0 }}>🏍️ Manage Garage</h3>
                        <form onSubmit={handleSaveGarage} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <div style={{ background: '#252525', padding: '15px', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ffcc00', margin: '0 0 10px 0' }}>Primary Bike</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input type="text" placeholder="Manufacturer (e.g. Honda)" value={garageForm.primaryBike.manufacturer} onChange={(e) => setGarageForm({ ...garageForm, primaryBike: { ...garageForm.primaryBike, manufacturer: e.target.value } })} required style={{ padding: '8px' }} />
                                    <input type="text" placeholder="Model Name (e.g. CB 150F)" value={garageForm.primaryBike.modelName} onChange={(e) => setGarageForm({ ...garageForm, primaryBike: { ...garageForm.primaryBike, modelName: e.target.value } })} required style={{ padding: '8px' }} />
                                    <input type="text" placeholder="Plate Number" value={garageForm.primaryBike.plateNumber} onChange={(e) => setGarageForm({ ...garageForm, primaryBike: { ...garageForm.primaryBike, plateNumber: e.target.value } })} required style={{ padding: '8px' }} />
                                </div>
                            </div>

                            <div style={{ background: '#252525', padding: '15px', borderRadius: '8px' }}>
                                <h4 style={{ color: '#ffcc00', margin: '0 0 10px 0' }}>Secondary Bike (Optional)</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <input type="text" placeholder="Manufacturer (e.g. Suzuki)" value={garageForm.secondaryBike.manufacturer} onChange={(e) => setGarageForm({ ...garageForm, secondaryBike: { ...garageForm.secondaryBike, manufacturer: e.target.value } })} style={{ padding: '8px' }} />
                                    <input type="text" placeholder="Model Name (e.g. GS 150)" value={garageForm.secondaryBike.modelName} onChange={(e) => setGarageForm({ ...garageForm, secondaryBike: { ...garageForm.secondaryBike, modelName: e.target.value } })} style={{ padding: '8px' }} />
                                    <input type="text" placeholder="Plate Number" value={garageForm.secondaryBike.plateNumber} onChange={(e) => setGarageForm({ ...garageForm, secondaryBike: { ...garageForm.secondaryBike, plateNumber: e.target.value } })} style={{ padding: '8px' }} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" style={{ flex: 1, background: '#ffcc00', color: '#000', padding: '10px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Save Garage</button>
                                {member.secondaryBike?.modelName && (
                                    <button type="button" onClick={handleRemoveSecondaryBike} style={{ background: '#cc0000', color: '#fff', padding: '10px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Remove Secondary 🗑️</button>
                                )}
                                <button type="button" onClick={() => setShowGarageModal(false)} style={{ background: '#444', color: '#fff', padding: '10px', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {!member ? (
                <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '40px', maxWidth: '450px', margin: '0 auto' }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <span style={{ background: '#ffcc00', color: '#000', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', display: 'inline-block' }}>Member Login</span>
                    </div>

                    {showForgotPassword ? (
                        <div>
                            <h3 style={{ color: '#ffcc00', textAlign: 'center' }}>🔒 Secure Password Recovery</h3>
                            {forgotStep === 1 ? (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const res = await axios.post('http://localhost:5000/api/members/forgot-password', { email: forgotEmail });
                                        showModal('OTP Sent', res.data.message, 'success');
                                        setForgotStep(2);
                                    } catch (err) {
                                        showModal('Error', err.response?.data?.error || 'Email not found', 'error');
                                    }
                                }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <input type="email" placeholder="Enter your registered email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required style={{ padding: '12px' }} />
                                    <button type="submit" style={{ background: '#ffcc00', color: '#000', padding: '12px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Send WhatsApp OTP</button>
                                    <button type="button" onClick={() => { setShowForgotPassword(false); setForgotStep(1); }} style={{ background: 'transparent', color: '#aaa', border: 'none', cursor: 'pointer' }}>Back to Login</button>
                                </form>
                            ) : (
                                <form onSubmit={async (e) => {
                                    e.preventDefault();
                                    try {
                                        const res = await axios.post('http://localhost:5000/api/members/verify-otp', { email: forgotEmail, otp: otpCode });
                                        setRecoveredPassword(res.data.password);
                                        showModal('Success', 'OTP verified successfully!', 'success');
                                    } catch (err) {
                                        showModal('Error', err.response?.data?.error || 'Invalid OTP', 'error');
                                    }
                                }} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    {!recoveredPassword ? (
                                        <>
                                            <p style={{ color: '#aaa', fontSize: '13px', textAlign: 'center', margin: 0 }}>Enter the 4-digit OTP sent to your WhatsApp number.</p>
                                            <input type="text" placeholder="Enter 4-digit OTP" value={otpCode} onChange={(e) => setOtpCode(e.target.value)} required style={{ padding: '12px', textAlign: 'center', letterSpacing: '4px', fontSize: '18px' }} />
                                            <button type="submit" style={{ background: '#ffcc00', color: '#000', padding: '12px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Verify OTP</button>
                                        </>
                                    ) : (
                                        <div style={{ background: '#222', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                                            <p style={{ color: '#28a745', fontWeight: 'bold', margin: '0 0 10px 0' }}>✅ Identity Verified!</p>
                                            <p style={{ margin: '5px 0', fontSize: '14px' }}>Your Password is: <b style={{ color: '#ffcc00', fontSize: '16px' }}>{recoveredPassword}</b></p>
                                            <button type="button" onClick={() => { setShowForgotPassword(false); setForgotStep(1); setRecoveredPassword(''); setForgotEmail(''); }} style={{ background: '#ffcc00', color: '#000', padding: '10px 20px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer', marginTop: '10px' }}>Back to Login</button>
                                        </div>
                                    )}
                                </form>
                            )}
                        </div>
                    ) : (
                        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            <input type="email" placeholder="Email Address" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required style={{ padding: '12px' }} />
                            <input type="password" placeholder="Password" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} required style={{ padding: '12px' }} />
                            <button type="submit" style={{ background: '#ffcc00', color: '#000', padding: '14px', fontWeight: 'bold', border: 'none', borderRadius: '8px', cursor: 'pointer', textTransform: 'uppercase' }}>Login</button>
                            <div style={{ textAlign: 'right' }}>
                                <button type="button" onClick={() => setShowForgotPassword(true)} style={{ background: 'none', border: 'none', color: '#ffcc00', cursor: 'pointer', fontSize: '13px' }}>Forgot Password?</button>
                            </div>
                        </form>
                    )}
                </div>
            ) : (
                /* Member Dashboard */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
                        <div>
                            <h2 style={{ color: '#ffcc00', margin: '0 0 8px 0' }}>Welcome, {member.fullName}! 🏍️</h2>
                            <p style={{ margin: '3px 0', color: '#aaa' }}>📧 {member.email} | 📞 {member.mobileNumber}</p>
                            <p style={{ margin: '3px 0', color: '#aaa' }}>🏠 {member.address}</p>
                        </div>
                        <button onClick={handleLogout} style={{ background: '#cc0000', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}>Log Out 🚪</button>
                    </div>

                    {/* Stats & Badges Row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
                        <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                            <h4 style={{ color: '#aaa', margin: '0 0 5px 0' }}>Total KM Driven</h4>
                            <h2 style={{ color: '#ffcc00', margin: 0 }}>{myStats.totalKm} KM</h2>
                        </div>
                        <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
                            <h4 style={{ color: '#aaa', margin: '0 0 5px 0' }}>Total Trips Completed</h4>
                            <h2 style={{ color: '#ffcc00', margin: 0 }}>{myStats.totalTours} Tours</h2>
                        </div>
                        <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '20px', textAlign: 'center', gridColumn: 'span 2' }}>
                            <h4 style={{ color: '#aaa', margin: '0 0 8px 0' }}>My Milestone Badges 🏅</h4>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                                {myStats.badges.map((badge, idx) => (
                                    <span key={idx} style={{ background: '#252525', border: '1px solid #ffcc00', color: '#ffcc00', padding: '6px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: 'bold' }}>{badge}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Emergency & Garage Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                        <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '25px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3 style={{ color: '#ffcc00', margin: 0 }}>🚨 Emergency Contact</h3>
                                <button onClick={openEmergencyModal} style={{ background: '#ffcc00', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Edit ✏️</button>
                            </div>
                            <p><b>Name:</b> {member.emergencyContact?.name || 'Not Provided'}</p>
                            <p><b>Relation:</b> {member.emergencyContact?.relation || 'N/A'}</p>
                            <p><b>Phone:</b> {member.emergencyContact?.phone || 'N/A'}</p>
                        </div>

                        <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '25px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                <h3 style={{ color: '#ffcc00', margin: 0 }}>🏍️ Multi-Bike Garage</h3>
                                <button onClick={openGarageModal} style={{ background: '#ffcc00', color: '#000', border: 'none', padding: '4px 10px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', fontSize: '12px' }}>Manage ⚙️</button>
                            </div>
                            <p><b>Primary:</b> {member.primaryBike?.manufacturer} {member.primaryBike?.modelName} ({member.primaryBike?.plateNumber})</p>
                            {member.secondaryBike?.modelName ? (
                                <p><b>Secondary:</b> {member.secondaryBike?.manufacturer} {member.secondaryBike?.modelName} ({member.secondaryBike?.plateNumber})</p>
                            ) : (
                                <p style={{ color: '#aaa', fontSize: '13px' }}>No secondary bike added.</p>
                            )}
                        </div>
                    </div>

                    {/* Digital Vault */}
                    <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '25px' }}>
                        <h3 style={{ color: '#ffcc00', marginTop: 0 }}>📂 Digital Vault (CNIC & Bike Papers)</h3>
                        <form onSubmit={submitVaultDoc} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '20px' }}>
                            <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ padding: '10px' }}>
                                <option value="CNIC">CNIC Copy</option>
                                <option value="Bike Paper">Bike Registration Paper</option>
                                <option value="License">Driving License</option>
                            </select>
                            <input type="text" placeholder="Document Name" value={docName} onChange={(e) => setDocName(e.target.value)} required style={{ padding: '10px' }} />
                            <input type="file" onChange={handleFileUpload} required style={{ padding: '8px' }} />
                            <button type="submit" style={{ background: '#ffcc00', color: '#000', padding: '10px', fontWeight: 'bold', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Upload to Vault</button>
                        </form>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {vaultDocs.map((doc, idx) => (
                                <div key={idx} style={{ background: '#222', padding: '12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: 'bold' }}>{doc.docName} ({doc.docType})</p>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#aaa' }}>Uploaded: {doc.uploadDate}</p>
                                    </div>
                                    <a href={doc.fileData} target="_blank" rel="noreferrer" style={{ background: '#ffcc00', color: '#000', padding: '6px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', fontSize: '12px' }}>View File 👁️</a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Upcoming Rides Registration with Active Registration Check */}
                    <div style={{ background: '#161616', border: '1px solid #333', borderRadius: '16px', padding: '25px' }}>
                        <h3 style={{ color: '#ffcc00', marginTop: 0 }}>🚀 Upcoming Rides Registration</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {upcomingRides.map(ride => {
                                const isAlreadyRegistered = ride.registeredRiders && ride.registeredRiders.includes(member.email);
                                return (
                                    <div key={ride._id} style={{ background: '#222', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                        <div>
                                            <h4 style={{ color: '#fff', margin: '0 0 5px 0' }}>{ride.title} ({ride.distanceKm || 150} KM)</h4>
                                            <p style={{ color: '#ffcc00', margin: '2px 0', fontSize: '13px' }}>📍 Dest: {ride.destination} | 🚩 Meetup: {ride.meetupLocation}</p>
                                        </div>
                                        {isAlreadyRegistered ? (
                                            <button disabled style={{ background: '#28a745', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'not-allowed', opacity: 0.9 }}>
                                                Already Registered ✅
                                            </button>
                                        ) : (
                                            <button onClick={() => handleOpenChecklist(ride)} style={{ background: '#ffcc00', color: '#000', border: 'none', padding: '10px 18px', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                                Register for Ride 🏍️
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}