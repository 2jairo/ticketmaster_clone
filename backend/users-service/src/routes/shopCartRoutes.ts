import { Router } from 'express';
import { verifyJWT } from '../middleware/auth';
import { updateShoppingCart, getShoppingCart, clearCart } from '../controllers/shopCart';

const router = Router();

router.get('/', verifyJWT, getShoppingCart);
router.put('/', verifyJWT, updateShoppingCart);
router.post('/clear', verifyJWT, clearCart)

export default router;
