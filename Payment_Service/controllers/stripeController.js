import Stripe from 'stripe';
import dotenv from 'dotenv';
import axios from 'axios'; // Add this to call Order Service
dotenv.config();

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
    console.error('❌ Webhook error while parsing:', err.message);
    return res.sendStatus(400);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const orderId = session.metadata.order_id; // Get the orderId from Stripe metadata
    console.log('✅ Payment successful for Order ID:', orderId);

    try {
      // Update Order Service: Mark payment as "Paid"
      const response = await axios.patch(`http://order_service:8089/api/orders/order/${orderId}/paymentstatus`, {
        paymentStatus: 'Paid'
      });

      console.log(`✅ Successfully updated Order ${orderId} to Paid.`);

    } catch (error) {
      console.error('❌ Failed to update payment status in Order Service:', error.message);
    }
  }

  res.status(200).send('Webhook received');
};

