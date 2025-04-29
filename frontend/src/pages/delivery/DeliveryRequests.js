import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function DeliveryRequests() {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);

  useEffect(() => {
    const fetchDeliveries = async () => {
      try {
        const response = await axios.get('http://localhost:8090/api/v1/driver/delivery-requests/680b9ac31ca12da0c207f03c');
        if (response.data.success) {
          const pendingDeliveries = response.data.deliveries.filter(delivery => delivery.status === "Pending");
          setDeliveries(pendingDeliveries);
        }
      } catch (error) {
        console.error('Error fetching delivery requests:', error);
      }
    };

    fetchDeliveries();
  }, []);

  return (
    <div style={styles.profileContainer}>
      <div style={styles.sidebar}>
      <button style={{ ...styles.sidebarBtn, ...styles.activeBtn }} onClick={() => navigate('/deliveryDashboard')}>My Profile</button>
        <button style={styles.sidebarBtn} onClick={() => navigate('/')}>Delivery Requests</button>
        <button style={styles.sidebarBtn} onClick={() => navigate('/trackingUpdates')}>Tracking Updates</button>
        <button style={styles.sidebarBtn} onClick={() => navigate('/deliveryHistory')}>Delivery History</button>
        <button style={{ ...styles.sidebarBtn, ...styles.logoutBtn }}>Logout</button>
        <div>
          <img
            src="https://img.freepik.com/free-vector/delivery-service-concept-illustration_114360-2606.jpg"
            alt="Delivery"
            style={styles.sidebarImage}
          />
        </div>
      </div>

      <div style={styles.detailsSection}>
        <h1 style={styles.heading}>My Delivery Requests</h1>

        {deliveries.length === 0 ? (
          <p>No pending delivery requests available.</p>
        ) : (
          deliveries.map((delivery) => (
            <div key={delivery._id} style={styles.requestCard}>
              <p style={styles.requestCardP}><strong>Delivery Id :</strong> {delivery._id}</p>
              <p style={styles.requestCardP}><strong>Order Id :</strong> {delivery.orderId}</p>
              <p style={styles.requestCardP}><strong>Current Location :</strong> Lat {delivery.currentLocation.lat}, Lng {delivery.currentLocation.lng}</p>
              <p style={styles.requestCardP}><strong>Destination :</strong> Lat {delivery.destination.lat}, Lng {delivery.destination.lng}</p>
              <div style={styles.buttons}>
                <button style={styles.acceptBtn}>Accept</button>
                <button style={styles.rejectBtn}>Reject</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// Inline styles object
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
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
  },
  sidebarBtnActive: {
    backgroundColor: '#00838f',
    color: 'white',
    fontWeight: 'bold',
    padding: '10px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  logoutBtn: {
    marginTop: '20px',
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
  heading: {
    marginBottom: '30px',
  },
  requestCard: {
    backgroundColor: '#f5f5f5',
    padding: '20px',
    marginBottom: '20px',
    borderRadius: '10px',
  },
  requestCardP: {
    margin: '5px 0',
  },
  buttons: {
    marginTop: '20px',
    display: 'flex',
    gap: '20px',
  },
  acceptBtn: {
    backgroundColor: '#66cc66',
    color: 'black',
    fontWeight: 'bold',
    border: 'none',
    padding: '10px 30px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
  rejectBtn: {
    backgroundColor: '#e57373',
    color: 'black',
    fontWeight: 'bold',
    border: 'none',
    padding: '10px 30px',
    borderRadius: '10px',
    cursor: 'pointer',
  },
};

export default DeliveryRequests;
