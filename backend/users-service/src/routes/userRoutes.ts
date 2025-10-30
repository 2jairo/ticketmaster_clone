import { Router } from 'express'
import { getUserInfo, handleLogin, handleSignin, logout, refreshAccessToken, updateUserInfo, updateUserPassword } from '../controllers/user'
import { verifyJWT } from '../middleware/auth'

const router = Router()

router.post('/refresh', refreshAccessToken)
router.post('/logout', logout)
router.post('/login', handleLogin)
router.post('/signin', handleSignin)
router.get('/user', verifyJWT, getUserInfo)
router.post('/update', verifyJWT, updateUserInfo)
router.post('/update/password', verifyJWT, updateUserPassword)

export default router