import './App.css';
import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import PaymentPage from "./pages/payment/PaymentPage";
import PaymentSuccess from "./pages/payment/PaymentSuccess";
import PaymentCancel from "./pages/payment/PaymentCancel";
import HomePage from './pages/HomePage';
import Review from './pages/Review';
import DeliveryDashboard from './pages/delivery/DeliveryDashboard';
import RestaurantRegistration  from './pages/restaurant/RestaurantRegistration';
import DeliveryHistory from './pages/delivery/DeliveryHistory';
import DeliveryRequests from './pages/delivery/DeliveryRequests';
import TrackingUpdates from './pages/delivery/TrackingUpdates';
import Login from './pages/UserLogin'
import Carts from './pages/order/Carts';
import Cart from './pages/order/Cart';
import MenuItemForm from './pages/restaurant/MenuItemForm'
import Orders from './pages/order/Orders';
import Order from './pages/order/Order';
import Pagenotfound from './pages/pageNotFound'


function App() {
  return (
    <>
      <Toaster position="top-right" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<Pagenotfound />} />
        <Route path="/Loginpage" element={<Login />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/payment/success" element={<PaymentSuccess />} />
        <Route path="/payment/cancel" element={<PaymentCancel />} />
        <Route path="/review" element={<Review />} />
        <Route path="/deliveryDashboard" element={<DeliveryDashboard />} />
        <Route path="/RestaurantRegistration" element={<RestaurantRegistration />} />
        <Route path="/addItem" element={<MenuItemForm />} />
        <Route path="/deliveryHistory" element={<DeliveryHistory />} />
        <Route path="/deliveryRequests" element={<DeliveryRequests />} />
        <Route path="/trackingUpdates" element={<TrackingUpdates />} />
        <Route path="/carts" element={<Carts />} />
        <Route path="/cart/:cid/:rid" element={<Cart />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/order/:id" element={<Order />} />

      </Routes>
    </>
  );
}

export default App;
