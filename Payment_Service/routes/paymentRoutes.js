import express from 'express';
import { createStripeSession, handleStripeWebhook } from '../controllers/stripeController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/stripe/create-session', createStripeSession);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

export default router;
