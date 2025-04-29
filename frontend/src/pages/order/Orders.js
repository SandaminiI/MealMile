import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import '../../components/style/orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // const customer = JSON.parse(localStorage.getItem('user')); // ✅ get logged in user
    // const cid = customer?._id;
    const cid = 'cus001';

    const fetchOrders = async () => {
        if (!cid) {
            console.error('Customer ID not found');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`http://localhost:8089/api/orders/${cid}`);
            if (!res.ok) {
                throw new Error('Failed to fetch orders');
            }
            const data = await res.json();
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
                                <p><strong>Restaurant ID:</strong> <span className="highlight">{order.restaurantId}</span></p>
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
