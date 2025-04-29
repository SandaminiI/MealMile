import Stripe from 'stripe';
import dotenv from 'dotenv';
import axios from 'axios'; // Add this to call Order Service
dotenv.config();
import { sendReceiptEmail } from '../services/emailService.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createStripeSession = async (req, res) => {
  const { orderId, amount, email } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'lkr',
          product_data: {
            name: 'MealMile Order Payment',
          },
          unit_amount: amount * 100,
        },
        quantity: 1
      }],
      mode: 'payment',
      customer_email: email,
      success_url: `${process.env.FRONTEND_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel`,
      metadata: {
        order_id: orderId,
        customer_email: email,
      }
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


export const handleStripeWebhook = async (req, res) => {
  let event;

  try {
    event = JSON.parse(req.body);
  } catch (err) {
    console.error('❌ Webhook parsing failed:', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata?.order_id;

    if (!orderId) {
      console.error('❌ Missing order ID in session metadata.');
      return res.sendStatus(400);
    }

    try {
      // 1. Mark order as paid
      await axios.patch(`http://order_service:8089/api/orders/order/${orderId}/paymentstatus`, {
        paymentStatus: 'Paid'
      });

      console.log(`✅ Order ${orderId} marked as Paid`);

      // 2. Retrieve updated order details
      const { data: order } = await axios.get(`http://order_service:8089/api/orders/order/${orderId}`);

      // 3. Send receipt email
      if (session.customer_email && order) {
        await sendReceiptEmail(session.customer_email, order);
        console.log(`✅ Email sent to ${session.customer_email}`);
      } else {
        console.warn('⚠️ Missing customer email or order data. Email not sent.');
      }

    } catch (err) {
      console.error('❌ Error updating order or sending email:', err.message);
    }
  }

  res.status(200).send('Webhook received');
};
