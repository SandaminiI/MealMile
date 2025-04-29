const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    cartId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    customerId: {
        type: String,
        require:true
    },
    restaurantId: {
        type: String,
        require:true
    },
    items: [
        {
            itemId: {
                type: String,
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1,
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true,
        default: 0,
    },
    phoneNo: {
        type: String,
        required: true,
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'Pending', 
            'Confirmed', 
            'Preparing', 
            'Ready for Delivery', 
            'Out for Delivery', 
            'Delivered', 
            'Cancelled'
        ],
        default: 'Pending'
    },
    paymentStatus: {
        type: String,
        enum: [
            'Unpaid',
            'Paid',
            'Failed'
        ],
        default: 'Unpaid'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);