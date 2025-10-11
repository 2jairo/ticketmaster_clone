import { Router } from 'express'
import { getUserInfo, handleLogin, handleSignin } from '../controllers/user'
import { verifyJWT } from '../middleware/auth'

const router = Router()

router.post('/login', handleLogin)
router.post('/signin', handleSignin)
router.get('/user', verifyJWT, getUserInfo)

export default router