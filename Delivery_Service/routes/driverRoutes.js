import express from 'express';
import {
  createDriverController,
  getAllDriversController,
  updateAvailabilityController,
  updateDriverLocationController,
  respondToDeliveryRequestController,
  getAllDeliveryRequestsController,
  getDriverByIdController,
  updateDriverController,
} from '../Controllers/DriverController.js';

const router = express.Router();

// Create a new driver
router.post('/create', createDriverController);

// Get all drivers
router.get('/', getAllDriversController);

// Update driver availability
router.put('/availability/:id', updateAvailabilityController);

// Update driver current location
router.put('/location/:id', updateDriverLocationController);

// Driver responds to a delivery request (accept or reject)
router.put('/respond-delivery/:id', respondToDeliveryRequestController);

// Get delivery requests assigned to a specific driver
router.get('/delivery-requests/:driverId', getAllDeliveryRequestsController);

// Get single driver by ID
router.get('/get/:driverId', getDriverByIdController);

// Update driver details
router.put('/update/:id', updateDriverController);



export default router;
