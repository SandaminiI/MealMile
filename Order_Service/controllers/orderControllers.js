const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const axios = require("axios");

// @desc View all orders
// @route GET /api/orders/:cid
const getOrders = asyncHandler(async (req, res) => {
  const { cid } = req.params;

  if (!cid) {
    res.status(400);
    throw new Error("CustomerId is required");
  }

  const orders = await Order.find({ customerId: cid }).sort({ createdAt: -1 });

  if (!orders || orders.length === 0) {
    return res.status(404).json({ message: "No orders found" });
  }

  res.status(200).json(orders);
});

// @desc Place a new order
// @route POST /api/orders/:cartId
const createOrder = asyncHandler(async(req,res) => {
    const {cartId} = req.params;
    const {phoneNo, deliveryAddress, lat, lng, totalAmount} = req.body;

    if(!cartId, !phoneNo, !deliveryAddress || totalAmount == null ){
        res.status(400);
        throw new Error("cartId, phoneNo and deliveryAddress are required");
    }

    const cart = await Cart.findById(cartId);

    if(!cart){
        res.status(404);
        throw new Error("Cart not found");
    }

    const order = new Order({
        cartId: cart._id,
        customerId: cart.customerId,
        restaurantId: cart.restaurantId,
        items: cart.items,
        totalAmount: totalAmount,
        phoneNo: phoneNo,
        deliveryAddress: deliveryAddress,
        lat: lat,
        lng: lng,
        status: "Pending",
        paymentStatus: "Unpaid"
    });

    await order.save();

    await Cart.deleteOne({_id: cart._id});

    res.status(201).json({
        message: "Order created successfully",
        order
    });
});

// @desc View an order
// @route GET /api/orders/order/:oid
const getOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;

  if (!oid) {
    res.status(400);
    throw new Error("OrderId is required");
  }

  const order = await Order.findById(oid);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json(order);
});

// @desc Update an order (delivery address)
// @route PUT /api/orders/order/:oid
const updateOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { deliveryAddress } = req.body;

  if (!oid || !deliveryAddress) {
    res.status(400);
    throw new Error("OrderId and new deliveryAddress are required");
  }

  const order = await Order.findById(oid);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  order.deliveryAddress = deliveryAddress;

  await order.save();

  res.status(200).json({
    message: "Delivery address updated successfully",
    order,
  });
});

// @desc Delete an order
// @route DELETE /api/orders/order/:oid
const deleteOrder = asyncHandler(async (req, res) => {
  const { oid } = req.params;

  if (!oid) {
    res.status(400);
    throw new Error("OrderId is required");
  }

  const order = await Order.findById(oid);

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  if (order.status !== "Pending") {
    return res
      .status(400)
      .json({ message: "Cannot delete. Order is already being processed." });
  }

  await order.deleteOne();

  res.status(200).json({ message: "Order deleted successfully" });
});

// @desc Track status update
// @route GET /api/orders/order/:oid/status
const trackStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;

  if (!oid) {
    res.status(400);
    throw new Error("OrderId is required");
  }

  const order = await Order.findById(oid).select("status");

  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }

  res.status(200).json({
    orderId: oid,
    status: order.status,
  });
});

// @desc Update order status
// @route PATCH /api/order/:id/status
const updateStatus = asyncHandler(async(req,res) => {
    res.status(200).json({message: `Update status for ${req.params.id}`});
});


// @desc Update Payment Status and trigger delivery assignment
// @route PATCH /api/orders/order/:oid/paymentstatus
const updatePaymentStatus = asyncHandler(async (req, res) => {
    try {
      const { paymentStatus } = req.body;
      const order = await Order.findById(req.params.oid);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      order.paymentStatus = paymentStatus || order.paymentStatus;
      await order.save();
  
      if (paymentStatus === "Paid") {
        console.log("💳 Payment marked as 'Paid' for order:", order._id);
  
        try {
          // 🔁 Fetch restaurant details
          const { data } = await axios.get(
            `http://resturant_service:8086/api/v1/auth/getSingleUser/${order.restaurantId}`
          );

          const restaurant = data.user;
  
          if (
            !restaurant ||
            typeof restaurant.lat !== "number" ||
            typeof restaurant.lng !== "number"
          ) {
            console.error("⚠ Invalid restaurant location data");
            return res
              .status(400)
              .json({ message: "Invalid restaurant location data" });
          }
  
          // ✅ Prepare delivery payload
          const deliveryPayload = {
            orderId: order._id,
            customerId: order.customerId,
            destination: {
              lat: parseFloat(order.lat),
              lng: parseFloat(order.lng),
            },
            pickupLocation: {
              lat: restaurant.lat,
              lng: restaurant.lng,
            },
          };
  
          // 🔍 Debug payload data
          console.log("📦 Prepared deliveryPayload:", deliveryPayload);
  
          // 🔁 Send to delivery service
          const deliveryRes = await axios.post(
            "http://delivery_service:8090/api/v1/delivery/assign",
            deliveryPayload
          );
  
          console.log("✅ Delivery assigned for order:", order._id);
          console.log("📨 Delivery service response:", deliveryRes.data);
  
        } catch (deliveryError) {
          console.error("🚫 Delivery assignment failed:", deliveryError.message);
          console.error("📋 Error Details:", deliveryError.response?.data || deliveryError.toJSON());
        }
      }
  
      res.status(200).json({ message: "Payment status updated", order });
  
    } catch (error) {
      console.error("❌ updatePaymentStatus error:", error);
      res.status(500).json({ message: error.message });
    }
  });
  

module.exports = {
  getOrders,
  createOrder,
  getOrder,
  updateOrder,
  deleteOrder,
  trackStatus,
  updateStatus,
  updatePaymentStatus,
};
