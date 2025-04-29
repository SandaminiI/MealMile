import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { useNavigate } from 'react-router-dom';


const containerStyle = {
  width: '100%',
  height: '400px',
};

const DRIVER_ID = '680b9a5f1ca12da0c207f03a'; // Replace with dynamic if needed

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [driver, setDriver] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [address, setAddress] = useState('');
  const [markerPosition, setMarkerPosition] = useState({ lat: 0, lng: 0 });

  // --- Fetch driver data initially
  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const res = await axios.get(`http://localhost:8090/api/v1/driver/get/${DRIVER_ID}`);
        const myDriver = res.data.driver;

        setDriver(myDriver);
        setName(myDriver.name || '');
        setPhone(myDriver.phone || '');
        setEmail(myDriver.email || '');
        setIsAvailable(myDriver.isAvailable !== undefined ? myDriver.isAvailable : true);
        setLatitude(myDriver.currentLocation?.lat || '');
        setLongitude(myDriver.currentLocation?.lng || '');
        setAddress(myDriver.currentLocation?.address || '');

        if (myDriver.currentLocation?.lat && myDriver.currentLocation?.lng) {
          setMarkerPosition({
            lat: parseFloat(myDriver.currentLocation.lat),
            lng: parseFloat(myDriver.currentLocation.lng),
          });
        }
      } catch (err) {
        console.error('Error fetching driver:', err);
      }
    };

    fetchDriver();
  }, []);

  // --- Handle Update
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!driver) {
      alert('Driver not loaded yet.');
      return;
    }

    try {
      await axios.put(`http://localhost:8090/api/v1/driver/update/${driver._id}`, {
        name,
        phone,
        email,
        isAvailable,
        currentLocation: {
          lat: parseFloat(latitude),
          lng: parseFloat(longitude),
          address,
        },
      });

      alert('Driver details updated successfully!');
    } catch (err) {
      console.error('Error updating driver:', err);
      alert('Error updating driver.');
    }
  };

  // --- Handle Map Click
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setLatitude(lat);
    setLongitude(lng);
    setMarkerPosition({ lat, lng });
  };

  // --- Handle Address change and auto-locate lat/lng
  const handleAddressChange = async (e) => {
    const newAddress = e.target.value;
    setAddress(newAddress);

    if (!newAddress) return;

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: newAddress,
            key: 'AIzaSyBgBbw-VnWQAriox72BrPyJRyIj0qIpuOc', // Your API Key
          },
        }
      );

      if (response.data.status === 'OK') {
        const location = response.data.results[0].geometry.location;
        setLatitude(location.lat);
        setLongitude(location.lng);
        setMarkerPosition({ lat: location.lat, lng: location.lng });
      } else {
        console.error('Geocode was not successful:', response.data.status);
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
    }
  };

  return (
    <div style={styles.profileContainer}>
      <div style={styles.sidebar}>
        <button style={{ ...styles.sidebarBtn, ...styles.activeBtn }} onClick={() => navigate('/')}>My Profile</button>
        <button style={styles.sidebarBtn} onClick={() => navigate('/deliveryRequests')}>Delivery Requests</button>
        <button style={styles.sidebarBtn} onClick={() => navigate('/trackingUpdates')}>Tracking Updates</button>
        <button style={styles.sidebarBtn} onClick={() => navigate('/deliveryHistory')}>Delivery History</button>
        <button style={{ ...styles.sidebarBtn, ...styles.logoutBtn }}>Logout</button>
        <div>
          <img
            style={styles.sidebarImage}
            src="https://img.freepik.com/free-vector/delivery-service-concept-illustration_114360-2606.jpg"
            alt="Delivery"
          />
        </div>
      </div>

      <div style={styles.detailsSection}>
        <h1>My Details</h1>
        <form style={styles.detailsForm} onSubmit={handleUpdate}>
          {/* Name */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Name</label>
            <input
              type="text"
              style={styles.inputField}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Phone */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Phone</label>
            <input
              type="text"
              style={styles.inputField}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          {/* Email */}
          <div style={styles.inputGroup}>
            <label style={styles.inputLabel}>Email</label>
            <input
              type="email"
              style={styles.inputField}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Availability */}
          <div style={styles.availabilityGroup}>
            <label style={styles.inputLabel}>Are You Available for Delivery?</label>
            <div style={styles.radioGroup}>
              <label>
                <input
                  type="radio"
                  name="available"
                  checked={isAvailable}
                  onChange={() => setIsAvailable(true)}
                />{' '}
                Yes
              </label>
              <label>
                <input
                  type="radio"
                  name="available"
                  checked={!isAvailable}
                  onChange={() => setIsAvailable(false)}
                />{' '}
                No
              </label>
            </div>
          </div>

          {/* Location Section */}
          <div style={styles.locationSection}>
            <h3>Update Your Current Location</h3>

            {/* Address Input */}
            <div style={{ ...styles.inputGroup, marginTop: '10px' }}>
              <label style={styles.inputLabel}>Address</label>
              <input
                type="text"
                style={styles.inputField}
                value={address}
                onChange={handleAddressChange}
                placeholder="Enter your current address"
              />
            </div>

            {/* Lat / Lng Inputs */}
            <div style={styles.coordinateGroup}>
              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Latitude</label>
                <input
                  type="text"
                  style={styles.inputField}
                  value={latitude}
                  onChange={(e) => setLatitude(e.target.value)}
                />
              </div>

              <div style={styles.inputGroup}>
                <label style={styles.inputLabel}>Longitude</label>
                <input
                  type="text"
                  style={styles.inputField}
                  value={longitude}
                  onChange={(e) => setLongitude(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button style={styles.updateBtn} type="submit">
            Update
          </button>
        </form>

        {/* Google Map */}
        <div style={styles.mapContainer}>
          <LoadScript googleMapsApiKey="AIzaSyBgBbw-VnWQAriox72BrPyJRyIj0qIpuOc">
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={markerPosition}
              zoom={15}
              onClick={handleMapClick}
            >
              <Marker position={markerPosition} />
            </GoogleMap>
          </LoadScript>
        </div>
      </div>
    </div>
  );
};

// --- Styles ---
const styles = {
  profileContainer: {
    display: 'flex',
    minHeight: '100vh',
    backgroundColor: '#e0f7f9',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#b2ebf2',
    padding: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  sidebarBtn: {
    backgroundColor: '#76d7db',
    color: 'black',
    fontWeight: 'bold',
    marginBottom: '5px',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  activeBtn: {
    backgroundColor: '#00838f',
    color: 'white',
  },
  logoutBtn: {
    marginTop: '20px',
    backgroundColor: '#76d7db',
  },
  sidebarImage: {
    width: '100%',
    marginTop: '20px',
  },
  detailsSection: {
    flex: 1,
    padding: '40px',
    backgroundColor: '#fff',
  },
  detailsForm: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: '20px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  inputLabel: {
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  inputField: {
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  availabilityGroup: {
    gridColumn: 'span 2',
  },
  radioGroup: {
    display: 'flex',
    gap: '20px',
    marginTop: '5px',
  },
  locationSection: {
    gridColumn: 'span 2',
    marginTop: '20px',
  },
  coordinateGroup: {
    display: 'flex',
    gap: '20px',
  },
  updateBtn: {
    gridColumn: 'span 2',
    marginTop: '20px',
    padding: '12px',
    backgroundColor: '#00838f',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '16px',
  },
  mapContainer: {
    marginTop: '20px',
  },
};

export default DriverDashboard;
