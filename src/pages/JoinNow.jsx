import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../components/Modal';

const bikeData = {
    "Suzuki": ["GD 110S", "GS 150", "GS 150 SE", "GSX 125", "GR 150"],
    "Honda": ["CD 70", "CD 70 Dream", "Pridor", "CG 125", "CG 125 Special Edition", "CB 125F", "CB 150F", "CBR150R (imported)", "CBR250RR (imported)", "CBR600RR (imported)", "CBR1000RR-R Fireblade (imported)", "Africa Twin (imported)", "Gold Wing (imported)"],
    "Yamaha": ["YB 125Z", "YB 125Z DX", "YBR 125", "YBR 125G", "YBR 250", "MT-03", "R3", "R6", "R1", "Tenere 700"],
    "United": ["US 70", "US 100", "US 125", "US 150"],
    "Road Prince": ["RP 70", "Passion Plus 70", "Wego 150", "RX3 250", "Robinson 150"],
    "Unique": ["UD 70", "UD 100", "UD 125", "Xtreme series"],
    "Super Power": ["SP 70", "SP 100", "SP 125", "SP 150", "RX-style sports models"],
    "Hi-Speed": ["SR 70", "SR 100", "SR 125", "Infinity 150"],
    "Crown": ["Crown 70cc models", "Crown 100cc models", "Crown 125cc models", "Electric two-wheelers"],
    "Super Star": ["CD 70", "SS 100 Deluxe", "G-90", "Batlo 4 ZS200"],
    "Benelli": ["TNT 150i", "TNT 300", "TNT 600i", "TRK 502", "Leoncino 500"],
    "BMW Motorrad": ["G 310 R", "G 310 GS", "F 850 GS", "F 900 GS", "R 1250 GS", "R 1300 GS", "S 1000 RR", "M 1000 RR"],
    "Kawasaki": ["Ninja 250", "Ninja 400", "Ninja ZX-4RR", "Ninja ZX-6R", "Ninja ZX-10R", "Ninja H2", "Z900", "Versys 650"],
    "KTM": ["Duke 200", "Duke 250", "Duke 390", "RC 390", "390 Adventure", "790 Adventure", "1290 Super Adventure"],
    "Ducati": ["Panigale V2", "Panigale V4", "Streetfighter V4", "Monster", "Multistrada V4", "DesertX", "Diavel V4"],
    "Aprilia": ["RS 457", "RS 660", "Tuono 660", "RSV4", "Tuareg 660"],
    "CFMoto": ["300NK", "450NK", "450SR", "450MT", "650MT", "800MT", "800NK"],
    "Royal Enfield": ["Classic 350", "Bullet 350", "Hunter 350", "Meteor 350", "Himalayan 450", "Interceptor 650", "Continental GT 650"],
    "Harley-Davidson": ["Street Bob", "Fat Boy", "Heritage Classic", "Sportster S", "Nightster", "Road Glide"]
};

export default function JoinNow() {
    const [formData, setFormData] = useState({
        fullName: '', fatherName: '', mobileNumber: '', address: '', email: '', password: '',
        emergencyContact: { name: '', mobileNumber: '', relation: '' },
        primaryBike: { manufacturer: 'Honda', modelName: 'CD 70', modelYear: '2026', plateNumber: '' },
        hasMultipleBikes: false,
        secondaryBike: { manufacturer: 'Honda', modelName: 'CD 70', modelYear: '2026', plateNumber: '' }
    });

    const [modal, setModal] = useState({ isOpen: false, title: '', message: '', type: 'info' });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            if (child === 'manufacturer') {
                const firstModel = bikeData[value] ? bikeData[value][0] : '';
                setFormData({
                    ...formData,
                    [parent]: { ...formData[parent], [child]: value, modelName: firstModel }
                });
            } else {
                setFormData({
                    ...formData,
                    [parent]: { ...formData[parent], [child]: type === 'checkbox' ? checked : value }
                });
            }
        } else {
            setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://jawan-bikers-backend.vercel.app/api/members/register', formData);
            setModal({
                isOpen: true,
                title: 'Welcome To The Tribe!',
                message: 'Your membership registration was successful! You can now log into your profile dashboard.',
                type: 'success'
            });
        } catch (err) {
            setModal({
                isOpen: true,
                title: 'Registration Error',
                message: err.response?.data?.error || 'Failed to complete registration.',
                type: 'error'
            });
        }
    };

    return (
        <div style={{ maxWidth: '900px', margin: '50px auto', padding: '45px', background: '#161616', border: '1px solid #333', borderRadius: '14px', boxShadow: '0 10px 30px rgba(0,0,0,0.8)' }}>
            
            <Modal 
                isOpen={modal.isOpen} 
                onClose={() => setModal({ ...modal, isOpen: false })} 
                title={modal.title} 
                message={modal.message} 
                type={modal.type} 
            />

            <h2 style={{ color: '#ffcc00', textAlign: 'center', marginBottom: '35px', fontSize: '28px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Join Jawan Bikers Community
            </h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                    <input type="text" name="fatherName" placeholder="Father's Name" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input type="text" name="mobileNumber" placeholder="Mobile Number" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                    <input type="text" name="address" placeholder="Residential Address" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <input type="email" name="email" placeholder="Email Address" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                    <input type="password" name="password" placeholder="Password" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                </div>

                <h4 style={{ color: '#ffcc00', marginTop: '20px', borderBottom: '1px solid #333', paddingBottom: '8px', fontSize: '18px' }}>
                    Emergency Contact
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px' }}>
                    <input type="text" name="emergencyContact.name" placeholder="Contact Name" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                    <input type="text" name="emergencyContact.mobileNumber" placeholder="Contact Mobile" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                    <input type="text" name="emergencyContact.relation" placeholder="Relation" onChange={handleChange} required style={{ padding: '14px', fontSize: '16px' }} />
                </div>

                <h4 style={{ color: '#ffcc00', marginTop: '20px', borderBottom: '1px solid #333', paddingBottom: '8px', fontSize: '18px' }}>
                    Primary Bike Details
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                    <select name="primaryBike.manufacturer" value={formData.primaryBike.manufacturer} onChange={handleChange} style={{ padding: '14px', fontSize: '15px' }}>
                        {Object.keys(bikeData).map(brand => (
                            <option key={brand} value={brand}>{brand}</option>
                        ))}
                    </select>
                    <select name="primaryBike.modelName" value={formData.primaryBike.modelName} onChange={handleChange} style={{ padding: '14px', fontSize: '15px' }}>
                        {bikeData[formData.primaryBike.manufacturer]?.map(model => (
                            <option key={model} value={model}>{model}</option>
                        ))}
                    </select>
                    <input type="text" name="primaryBike.modelYear" placeholder="Model Year (e.g. 2025)" onChange={handleChange} required style={{ padding: '14px', fontSize: '15px' }} />
                    <input type="text" name="primaryBike.plateNumber" placeholder="Plate Number" onChange={handleChange} required style={{ padding: '14px', fontSize: '15px' }} />
                </div>

                <label style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px', color: '#ccc', cursor: 'pointer', fontSize: '16px' }}>
                    <input type="checkbox" name="hasMultipleBikes" onChange={handleChange} style={{ width: '20px', height: '20px' }} />
                    I have more than one bike
                </label>

                {formData.hasMultipleBikes && (
                    <div style={{ background: '#222', padding: '20px', borderRadius: '10px', border: '1px dashed #444', marginTop: '10px' }}>
                        <h4 style={{ color: '#ffcc00', margin: '0 0 15px 0', fontSize: '16px' }}>Secondary Bike Details</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px' }}>
                            <select name="secondaryBike.manufacturer" value={formData.secondaryBike.manufacturer} onChange={handleChange} style={{ padding: '14px', fontSize: '15px' }}>
                                {Object.keys(bikeData).map(brand => (
                                    <option key={brand} value={brand}>{brand}</option>
                                ))}
                            </select>
                            <select name="secondaryBike.modelName" value={formData.secondaryBike.modelName} onChange={handleChange} style={{ padding: '14px', fontSize: '15px' }}>
                                {bikeData[formData.secondaryBike.manufacturer]?.map(model => (
                                    <option key={model} value={model}>{model}</option>
                                ))}
                            </select>
                            <input type="text" name="secondaryBike.modelYear" placeholder="Model Year (e.g. 2024)" onChange={handleChange} style={{ padding: '14px', fontSize: '15px' }} />
                            <input type="text" name="secondaryBike.plateNumber" placeholder="Plate Number" onChange={handleChange} style={{ padding: '14px', fontSize: '15px' }} />
                        </div>
                    </div>
                )}

                <button type="submit" style={{ backgroundColor: '#ffcc00', color: '#000', padding: '16px', fontWeight: 'bold', border: 'none', cursor: 'pointer', borderRadius: '8px', fontSize: '18px', marginTop: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    Submit Registration
                </button>
            </form>
        </div>
    );
}