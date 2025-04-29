import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
    restaurantId: {
        type: String,// Refers to the restaurant user
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        trim: true
    },
    image: {
        data: Buffer,
    contentType: String
    },
    isAvailable: {
        type: Boolean,
        default: true
    },
    tags: {
        type: [String], // array of strings
        default: [] // optional, but keeps it safe
    }
}, { timestamps: true });

export default mongoose.model('menuitems', menuItemSchema);