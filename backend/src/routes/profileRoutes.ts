import { Router } from 'express'
import { verifyJWT, verifyJWTOptional } from '../middleware/auth'
import { followMusicGroup, followUser, getUserProfile } from '../controllers/profile'

const router = Router()

router.get('/:username', verifyJWTOptional, getUserProfile)
router.post('/follow/group/:groupSlug', verifyJWT, followMusicGroup)
router.post('/follow/user/:username', verifyJWT, followUser)

export default router