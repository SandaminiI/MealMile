import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa'; // 👉 import Trash icon
import '../../components/style/carts.css';
import Layout from '../../components/Layout/Layout';

const Carts = () => {
    const [carts, setCarts] = useState([]);
    const navigate = useNavigate();

    // 🧠 Get user info from localStorage
    // const userInfo = JSON.parse(localStorage.getItem('auth'));
    // const cid = userInfo?.user?.id;
    const cid = 'cus001';

    const fetchCarts = async () => {
        if (!cid) {
            console.error('No customer ID found');
            return;
        }
        try {
            const res = await fetch(`http://localhost:8089/api/cart/${cid}`);
            if (!res.ok) throw new Error('Failed to fetch carts');
            const data = await res.json();
            setCarts(data.reverse());
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        fetchCarts();
    }, []);

    const viewCart = (cid, rid) => {
        navigate(`/cart/${cid}/${rid}`);
    };

    // 🧹 Handle cart delete
    const deleteCart = async (cid, rid) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this cart?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`http://localhost:8089/api/cart/${cid}/${rid}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                alert('Cart deleted successfully!');
                fetchCarts(); // refresh the cart list after deleting
            } else {
                console.error('Failed to delete cart');
                alert('Failed to delete the cart. Please try again.');
            }
        } catch (error) {
            console.error(error.message);
        }
    };

    return (
        <Layout>
            <div>
                <h2>My Carts</h2>
                <div className="cart-list">
                    {carts.map((cart) => (
                        <div 
                            key={cart.cartId} 
                            className="cart-container" 
                            onClick={() => viewCart(cart.customerId, cart.restaurantId)}
                            style={{ position: 'relative' }} // ✅ important for dustbin positioning
                        >
                            {/* Dustbin Icon */}
                            <FaTrash
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    right: '10px',
                                    color: '#D32F2F',
                                    cursor: 'pointer',
                                    zIndex: 1,
                                }}
                                onClick={(e) => {
                                    e.stopPropagation(); // 🛑 prevent triggering viewCart
                                    deleteCart(cart.customerId, cart.restaurantId);
                                }}
                            />

                            <h3>Restaurant: {cart.restaurantId}</h3>

                            {/* Items */}
                            <div className="cart-items">
                                {cart.items && cart.items.length > 0 ? (
                                    cart.items.map((item, index) => (
                                        <p key={index}>
                                            • Item: {item.itemId} × {item.quantity}
                                        </p>
                                    ))
                                ) : (
                                    <p>No items in cart</p>
                                )}
                            </div>

                            {/* Total Amount */}
                            <div className="cart-total">
                                <span>Total</span>
                                <span>Rs. {cart.totalAmount.toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Carts;
