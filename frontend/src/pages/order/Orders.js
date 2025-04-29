import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import '../../components/style/orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [restaurantMap, setRestaurantMap] = useState({});
    const navigate = useNavigate();

    const userInfo = JSON.parse(localStorage.getItem('auth'));
    const cid = userInfo?.user?.id;

    const fetchRestaurantName = async (rid) => {
        if (restaurantMap[rid]) return restaurantMap[rid]; // Already cached

        try {
            const res = await fetch(`http://localhost:8086/api/v1/auth/getSingleUser/${rid}`);
            if (!res.ok) throw new Error(`Failed to fetch restaurant ${rid}`);
            const data = await res.json();
            const name = data.user?.name || 'Unknown Restaurant';

            setRestaurantMap(prev => ({ ...prev, [rid]: name }));
            return name;
        } catch (error) {
            console.error(error);
            setRestaurantMap(prev => ({ ...prev, [rid]: 'Unknown Restaurant' }));
            return 'Unknown Restaurant';
        }
    };

    const fetchOrders = async () => {
        if (!cid) {
            console.error('Customer ID not found');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8089/api/orders/${cid}`);
            if (!res.ok) throw new Error('Failed to fetch orders');

            const data = await res.json();

            // Fetch all unique restaurant names
            const uniqueRids = [...new Set(data.map(order => order.restaurantId))];
            await Promise.all(uniqueRids.map(fetchRestaurantName));

            setOrders(data);
        } catch (error) {
            console.error(error.message);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [cid]);

    const handleOrderClick = (orderId) => {
        navigate(`/order/${orderId}`);
    };

    return (
        <Layout>
            <div className="orders-content">
                <h2>Your Orders</h2>
                {loading ? (
                    <p>Loading orders...</p>
                ) : orders.length === 0 ? (
                    <p>No orders found.</p>
                ) : (
                    <div className="orders-grid">
                        {orders.map((order) => (
                            <div 
                                className="order-card" 
                                key={order._id}
                                onClick={() => handleOrderClick(order._id)}
                                style={{cursor: 'pointer'}}
                            >
                                <p><strong>Order ID:</strong> {order._id}</p>
                                <p><strong>Phone Number:</strong> {order.phoneNo}</p>
                                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                                <p><strong>Restaurant:</strong> <span className="highlight">{restaurantMap[order.restaurantId] || 'Loading...'}</span></p>
                                <p><strong>Total Amount:</strong> <span className="highlight">Rs. {order.totalAmount?.toFixed(2)}</span></p>
                                <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span></p>
                                <p><strong>Payment Status:</strong> <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></p>
                                <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Orders;
