import mongoose from "mongoose";

const DeliverySchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  customerId: { type: String, required: true },
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'Driver' },
  rejectedDrivers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Driver' }], // ✨ NEW FIELD
  status: {
    type: String,
    enum: ['Pending', 'Assigned', 'Rejected', 'Picked Up', 'On the Way', 'Delivered', 'Unassigned'],
    default: 'Pending'
  },
  currentLocation: {
    lat: Number,
    lng: Number
  },
  destination: {
    lat: Number,
    lng: Number
  },
  createdAt: { type: Date, default: Date.now },
  assignmentExpiresAt: { type: Date } // ✨ NEW FIELD
});

export default mongoose.model('Delivery', DeliverySchema);
