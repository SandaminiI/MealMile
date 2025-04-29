import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/Layout/Layout';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';

const HomePage = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);

  const handleAddToCart = (item) => {
    console.log("Added to cart:", item.name); 
    toast.success(`${item.name} added to cart!`);
  };
  
  // Function to fetch all menu items
  const fetchMenuItems = async () => {
    try {
      const token = Cookies.get('access_token');
      const res = await axios.get('http://localhost:8086/api/v1/menuItem/getAllMenu');

      if (res.data.success) {
        setMenuItems(res.data.MenuItems);
      } else {
        toast.error('Failed to load menu items');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong while fetching menu items');
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  return (
    <Layout>
      <div style={{ padding: '20px' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>Menu Items</h1>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
          {menuItems.length > 0 ? (
            menuItems.map((item) => (
              <div key={item._id} style={cardStyle}>
                {/* Item Photo */}
                <img
                src={`http://localhost:8086/api/v1/menuItem/getItemphoto/${item._id}`} 
                alt={item.name}
                style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px 8px 0 0' }}
                />
                {/* Container for item info */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexGrow: 1 }}>
                  <div style={{ padding: '10px' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{item.name}</h3>
                    <p style={{ margin: '0 0 10px 0' }}>{item.description}</p>
                    </div>
                    {/* Price section */}
                    <div style={{ padding: '0 10px 10px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <p style={{ margin: 0, fontWeight: 'bold', color: '#BF3131' }}>Rs.{item.price}</p>
                      <button 
                          style={{ 
                            backgroundColor: '#BF3131', 
                            border: 'none', 
                            borderRadius: '4px', 
                            padding: '6px 8px', 
                            cursor: 'pointer', 
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onClick={() => handleAddToCart(item)} // You can define this function later
                        >
                          <FaShoppingCart />
                        </button>
                      </div>

                  </div>
                </div>

            ))
          ) : (
            <p>No menu items available.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

// Card style
const cardStyle = {
  width: '250px',
  height: '400px', // optional, consistent height
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  borderRadius: '8px',
  backgroundColor: '#fff',
  overflow: 'hidden',
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
};

export default HomePage;
