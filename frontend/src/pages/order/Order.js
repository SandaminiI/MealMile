import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../../components/Layout/Layout';
import '../../components/style/orders.css';

const Order = () => {
    const { id } = useParams(); // get the order id from URL
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const fetchOrder = async () => {
        try {
            const res = await fetch(`http://localhost:8089/api/orders/order/${id}`);
            if (!res.ok) {
                throw new Error('Failed to fetch order details');
            }
            const data = await res.json();
            setOrder(data);
        } catch (error) {
            console.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const statusSteps = [
        'pending',
        'confirmed',
        'preparing',
        'ready-for-delivery',
        'out-for-delivery',
        'delivered'
    ];

    if (loading) {
        return (
            <Layout>
                <div className="orders-content">
                    <p>Loading order details...</p>
                </div>
            </Layout>
        );
    }

    if (!order) {
        return (
            <Layout>
                <div className="orders-content">
                    <p>Order not found.</p>
                </div>
            </Layout>
        );
    }

    const currentStatusIndex = statusSteps.indexOf(order.status.toLowerCase().replace(/\s/g, '-'));

    return (
        <Layout>
            <div className="order-detail-body">
                <h2>Order Details</h2>

                <p><strong>Restaurant ID:</strong> <span className="highlight">{order.restaurantId}</span></p>
                <p><strong>Phone Number:</strong> {order.phoneNo}</p>
                <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                <p><strong>Total Amount:</strong> <span className="highlight">Rs. {order.totalAmount?.toFixed(2)}</span></p>
                <p><strong>Status:</strong> <span className={`status ${order.status.toLowerCase().replace(/\s/g, '-')}`}>{order.status}</span></p>

                {/* Process Line */}
                <div className="order-status-progress">
                    <div
                        className="progress-fill"
                        style={{
                            width: `${(currentStatusIndex / (statusSteps.length - 1)) * 90}%`
                        }}
                    ></div>

                    {statusSteps.map((step, index) => (
                        <div key={index} className="step-container">
                            <div className={`status-step ${index <= currentStatusIndex ? 'active' : ''}`}>
                                {index + 1}
                            </div>
                            <div className="status-label">{step.replace(/-/g, ' ')}</div>
                        </div>
                    ))}
                </div>

                <p><strong>Payment Status:</strong> <span className={`payment-status ${order.paymentStatus.toLowerCase()}`}>{order.paymentStatus}</span></p>
                <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                <div style={{ marginTop: '30px' }}>
                    <h3>Items:</h3>
                    <ul>
                        {order.items.map((item, index) => (
                            <li key={index}>
                                Item ID: {item.itemId} — Quantity: {item.quantity}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
};

export default Order;
