import express from 'express';
import { createReview, getRestaurantReviews, markReviewHelpful } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/restaurants/:id/reviews', createReview);
router.get('/restaurants/:id/reviews', getRestaurantReviews);
router.patch('/reviews/:id/helpful', markReviewHelpful );

export default router;
