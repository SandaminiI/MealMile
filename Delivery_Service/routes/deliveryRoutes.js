import express from 'express';
import {
  assignDriverController,
  getDeliveryStatusController,
  updateLocationController,
  updateStatusController,
  driverResponseController // ✅ Import the new controller
} from '../Controllers/deliveryController.js';

const router = express.Router();

// Assign a delivery (send email but wait for driver's acceptance)
router.post('/assign', assignDriverController);

// Driver responds to delivery request (accept/reject)
router.put('/driver-response/:id', driverResponseController); // ✅ New route

// Get status of a delivery
router.get('/:id', getDeliveryStatusController);

// Update current location of delivery
router.put('/update-location/:id', updateLocationController);

// Update delivery status (like Delivered, In-Progress, etc.)
router.put('/update-status/:id', updateStatusController);

export default router;
