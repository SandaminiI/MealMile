import Delivery from "../models/Delivery.js";
import Driver from "../models/Driver.js";
import nodemailer from "nodemailer";

const TIMEOUT_MINUTES = 5; // 5 minutes

// Helper: Calculate distance between two coordinates
function calculateDistance(lat1, lng1, lat2, lng2) {
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371; // Radius of Earth (km)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Helper: Send email to driver
const sendAssignmentEmail = async (driverEmail, driverName, deliveryDetails) => {
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "xenosysemail@gmail.com",
      pass: "doni gywl eitg bqmb",
    },
  });

  const mailOptions = {
    from: "xenosysemail@gmail.com",
    to: driverEmail,
    subject: "New Delivery Request - Awaiting Your Response",
    html: `
      <p>Dear ${driverName},</p>
      <p>You have a new delivery request.</p>
      <p><strong>Order ID:</strong> ${deliveryDetails.orderId}</p>
      <p><strong>Pickup:</strong> ${deliveryDetails.pickupLocation.lat}, ${deliveryDetails.pickupLocation.lng}</p>
      <p><strong>Destination:</strong> ${deliveryDetails.destination.lat}, ${deliveryDetails.destination.lng}</p>
      <p>Please respond via your dashboard to accept or reject this delivery.</p>
      <p>Thank you!</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Email sent to driver:", driverEmail);
  } catch (err) {
    console.error("Error sending email to driver:", err);
  }
};

// Enhanced handleTimeoutReassignment function
const handleTimeoutReassignment = async (delivery) => {
  try {
    // Always check for latest delivery state
    const freshDelivery = await Delivery.findById(delivery._id);
    if (!freshDelivery || freshDelivery.status !== 'Pending') return;

    // Add current driver to rejected list
    if (
      freshDelivery.driverId &&
      !freshDelivery.rejectedDrivers.some(id => id.equals(freshDelivery.driverId))
    ) {
      freshDelivery.rejectedDrivers.push(freshDelivery.driverId);
    }

    // Find eligible drivers
    const availableDrivers = await Driver.find({
      isAvailable: true,
      _id: { $nin: freshDelivery.rejectedDrivers }
    });

    // No drivers available
    if (availableDrivers.length === 0) {
      freshDelivery.driverId = null;
      freshDelivery.status = 'Unassigned';
      await freshDelivery.save();
      return;
    }

    // Find nearest valid driver
    let nearestDriver = null;
    let minDistance = Infinity;

    for (const driver of availableDrivers) {
      if (!driver.currentLocation?.lat || !driver.currentLocation?.lng) continue;

      const distance = calculateDistance(
        freshDelivery.currentLocation.lat,
        freshDelivery.currentLocation.lng,
        driver.currentLocation.lat,
        driver.currentLocation.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    }

    if (!nearestDriver) {
      freshDelivery.driverId = null;
      freshDelivery.status = 'Unassigned';
      await freshDelivery.save();
      return;
    }

    // Update delivery with new driver
    freshDelivery.driverId = nearestDriver._id;
    freshDelivery.assignmentExpiresAt = new Date(Date.now() + TIMEOUT_MINUTES * 60 * 1000);
    await freshDelivery.save();

    // Notify new driver
    await sendAssignmentEmail(nearestDriver.email, nearestDriver.name, {
      orderId: freshDelivery.orderId,
      pickupLocation: freshDelivery.currentLocation,
      destination: freshDelivery.destination
    });

    // Set new timeout
    setTimeout(async () => {
      const currentState = await Delivery.findById(freshDelivery._id);
      if (currentState?.status === 'Pending') {
        await handleTimeoutReassignment(currentState);
      }
    }, TIMEOUT_MINUTES * 60 * 1000);

  } catch (error) {
    console.error("Reassignment Error:", error);
  }
};


// Controller: Create a new driver
export const createDriverController = async (req, res) => {
  try {
    const { name, phone, email, currentLocation } = req.body;

    if (!name || !phone || !email || !currentLocation) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newDriver = new Driver({
      name,
      phone,
      email,
      currentLocation,
    });

    await newDriver.save();

    res.status(201).json({
      success: true,
      message: "Driver created successfully",
      driver: newDriver,
    });
  } catch (error) {
    console.error("Create Driver Error:", error);
    res.status(500).json({ success: false, message: "Error creating driver", error: error.message });
  }
};

// Controller: Assign driver to delivery
export const assignDriverController = async (req, res) => {
  try {
    const { orderId, customerId, destination, pickupLocation } = req.body;

    if (!orderId || !customerId || !destination || !pickupLocation) {
      return res.status(400).json({
        success: false,
        message: "All fields are required (orderId, customerId, destination, pickupLocation)"
      });
    }

    const availableDrivers = await Driver.find({ isAvailable: true });

    if (!availableDrivers.length) {
      return res.status(404).json({ success: false, message: "No available drivers" });
    }

    let nearestDriver = null;
    let minDistance = Infinity;

    for (const driver of availableDrivers) {
      if (!driver.currentLocation?.lat || !driver.currentLocation?.lng) continue;

      const distance = calculateDistance(
        pickupLocation.lat,
        pickupLocation.lng,
        driver.currentLocation.lat,
        driver.currentLocation.lng
      );

      if (distance < minDistance) {
        minDistance = distance;
        nearestDriver = driver;
      }
    }

    if (!nearestDriver) {
      return res.status(500).json({ success: false, message: "No drivers with valid location data" });
    }

    const delivery = new Delivery({
      orderId,
      customerId,
      driverId: nearestDriver._id,
      rejectedDrivers: [],
      status: 'Pending',
      currentLocation: pickupLocation,
      destination,
      assignmentExpiresAt: new Date(Date.now() + TIMEOUT_MINUTES * 60 * 1000) // ✨ 5 min from now
    });

    await delivery.save();

    await sendAssignmentEmail(nearestDriver.email, nearestDriver.name, {
      orderId,
      pickupLocation,
      destination
    });

    res.status(200).json({
      success: true,
      message: "Delivery request sent to nearest driver. Awaiting acceptance.",
      delivery,
      driver: {
        id: nearestDriver._id,
        name: nearestDriver.name,
        location: nearestDriver.currentLocation,
        distance: `${minDistance.toFixed(2)} km`
      }
    });

    // ✨ Set up a timeout check
    setTimeout(async () => {
      const latestDelivery = await Delivery.findById(delivery._id);
      if (latestDelivery && latestDelivery.status === 'Pending' && latestDelivery.assignmentExpiresAt <= new Date()) {
        console.log(`Driver did not respond in time. Reassigning delivery ${delivery._id}...`);
        await handleTimeoutReassignment(latestDelivery);
      }
    }, TIMEOUT_MINUTES * 60 * 1000); // 5 minutes

  } catch (error) {
    console.error("Assignment Error:", error);
    res.status(500).json({ success: false, message: "Error assigning driver", error: error.message });
  }
};

// Controller: Driver accepts/rejects delivery
// Controller: Driver accepts/rejects delivery
export const driverResponseController = async (req, res) => {
  try {
    const { id } = req.params; // Delivery ID
    const { response } = req.body; // 'accept' or 'reject'

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    const driver = await Driver.findById(delivery.driverId);
    if (!driver) {
      return res.status(404).json({ success: false, message: "Driver not found" });
    }

    if (response === 'accept') {
      delivery.status = 'Assigned';
      delivery.assignmentExpiresAt = null; // Clear timeout expiration
      await delivery.save();

      driver.isAvailable = false;
      await driver.save();

      return res.status(200).json({
        success: true,
        message: "Delivery accepted successfully",
        delivery
      });
    }

    if (response === 'reject') {
      // Add driver to rejectedDrivers array if not already added
      if (!delivery.rejectedDrivers.some(rejectedId => rejectedId.equals(driver._id))) {
        delivery.rejectedDrivers.push(driver._id);
      }

      driver.isAvailable = true;
      await driver.save();

      delivery.status = 'Pending'; // Keep it pending for reassignment
      await delivery.save();

      // Reassign delivery immediately
      await handleTimeoutReassignment(delivery);

      return res.status(200).json({
        success: true,
        message: "Driver rejected delivery. Reassigning to another driver...",
        delivery
      });
    }

    return res.status(400).json({ success: false, message: "Invalid response. Use 'accept' or 'reject'." });

  } catch (error) {
    console.error("Driver Response Error:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error", error: error.message });
  }
};


// Controller: Get delivery status
export const getDeliveryStatusController = async (req, res) => {
  try {
    const { id } = req.params;

    const delivery = await Delivery.findById(id).populate('driverId', 'name currentLocation');

    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    res.status(200).json({
      success: true,
      message: "Delivery status retrieved",
      delivery
    });

  } catch (error) {
    console.error("Status Error:", error);
    res.status(500).json({ success: false, message: "Error fetching delivery status", error: error.message });
  }
};

// Controller: Update driver location
export const updateLocationController = async (req, res) => {
  try {
    const { id } = req.params;
    const { currentLocation } = req.body;

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    delivery.currentLocation = currentLocation;
    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Location updated",
      delivery
    });

  } catch (error) {
    console.error("Location Update Error:", error);
    res.status(500).json({ success: false, message: "Error updating location", error: error.message });
  }
};

// Controller: Update delivery status
// Controller: Update delivery status with driver reassignment
export const updateStatusController = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, driverId } = req.body; // Add driverId in body for rejection

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      return res.status(404).json({ success: false, message: "Delivery not found" });
    }

    if (status === "Rejected") {
      // Add driver to rejected list
      if (!delivery.rejectedDrivers.includes(driverId)) {
        delivery.rejectedDrivers.push(driverId);
      }

      // Find a new available driver who has NOT rejected this delivery
      const availableDriver = await Driver.findOne({
        isAvailable: true,
        _id: { $nin: delivery.rejectedDrivers }
      });

      if (availableDriver) {
        delivery.driverId = availableDriver._id;
        // You might also want to send a notification to the new driver here
      } else {
        return res.status(400).json({ success: false, message: "No available drivers to assign" });
      }

    } else if (status === "Delivered") {
      const driver = await Driver.findById(delivery.driverId);
      if (driver) {
        driver.isAvailable = true;
        await driver.save();
      }
      delivery.status = status;
    } else {
      delivery.status = status;
    }

    await delivery.save();

    res.status(200).json({
      success: true,
      message: "Delivery status updated",
      delivery
    });

  } catch (error) {
    console.error("Status Update Error:", error);
    res.status(500).json({ success: false, message: "Error updating delivery status", error: error.message });
  }
};
