import { Router } from 'express';
import { getMerch } from '../controllers/merch';

const router = Router();

router.get('/', getMerch);

export default router;
