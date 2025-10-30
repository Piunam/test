import { Router } from 'express';
import { validatePromoCode } from '../controllers/bookingController.js';

const router = Router();

router.post('/validate', validatePromoCode);

export default router;
