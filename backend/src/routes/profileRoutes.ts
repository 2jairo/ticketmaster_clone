import { Router } from 'express'
import { verifyJWT } from '../middleware/auth'
import { followMusicGroup, followUser } from '../controllers/profile'

const router = Router()

router.post('/follow/group/:groupSlug', verifyJWT, followMusicGroup)
router.post('/follow/user/:username', verifyJWT, followUser)

export default router