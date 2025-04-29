// pages/RestaurantRegistration.js
import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';
import toast from 'react-hot-toast';

const containerStyle = {
  width: '100%',
  height: '400px',
};

const defaultCenter = {
  lat: 6.9271,
  lng: 79.8612,
};

const RestaurantRegistration = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    contactNumber: '',
    role:'2',
    lat: null,
    lng: null,
  });

  const [markerPosition, setMarkerPosition] = useState(defaultCenter);

  const handleChange = e => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setFormData(prev => ({
      ...prev,
      lat,
      lng,
    }));
    setMarkerPosition({ lat, lng });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    console.log('submit clicked');
  
    if (formData.lat === null || formData.lng === null) {
      toast.error('Please click on the map to select your location.');
      return;
    }
  
    try {
      const res = await axios.post('http://localhost:8086/api/v1/auth/register', {
        ...formData,
        role: 2, // make sure role is number, not string
      });
  
      console.log('awaaaa')
      console.log(res.data);
      if (res.data.success) {
        toast.success(res.data.message);
      } else {
        toast.error(res.data.message);
      }
  
    } catch (err) {
      console.log(err);
      toast.error('Something went wrong!!!');
    }
  };  
  

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2>Restaurant Registration</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Name" onChange={handleChange} required /><br />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required /><br />
        <input type="password" name="password" placeholder="Password" onChange={handleChange} required /><br />
        <input type="text" name="contactNumber" placeholder="Contact Number" onChange={handleChange} required /><br />
        <input type="text" name="address" placeholder="Enter Address" onChange={handleChange} required style={{marginTop: '10px',marginBottom: '10px',padding: '10px',width: '100%',}} />

        {/* Google Map */}
        <LoadScript googleMapsApiKey="AIzaSyBgBbw-VnWQAriox72BrPyJRyIj0qIpuOc">
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={markerPosition}
            zoom={15}
            onClick={handleMapClick} // click event here
          >
            <Marker position={markerPosition} />
          </GoogleMap>
        </LoadScript>

        {/* Show lat/lng */}
        {/* <p><strong>Latitude:</strong> {formData.lat}</p>
        <p><strong>Longitude:</strong> {formData.lng}</p> */}

        <button type="submit" style={{ marginTop: '20px', marginBottom: ' 50px' }}>Register</button>
      </form>
    </div>
  );
};

export default RestaurantRegistration;
