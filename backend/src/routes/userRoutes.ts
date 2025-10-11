import { Router } from 'express'
import { getUserInfo, handleLogin, handleSignin } from '../controllers/user'
import { verifyJWT } from '../middleware/auth'

const router = Router()

router.post('/auth/login', handleLogin)
router.post('/auth/signin', handleSignin)
router.get('/auth/user', verifyJWT, getUserInfo)

export default router