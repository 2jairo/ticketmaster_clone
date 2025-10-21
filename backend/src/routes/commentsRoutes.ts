import { Router } from 'express'
import { verifyJWT, verifyJWTOptional } from '../middleware/auth'
import { createComment, deleteComment, getComments, setLikeComment } from '../controllers/comments'

const router = Router()

router.post('/like/:commentId', verifyJWT, setLikeComment)
router.post('/create/:concertSlug', verifyJWT, createComment)
router.get('/:concertSlug', verifyJWTOptional, getComments)
router.delete('/:concertSlug/:commentId', verifyJWT, deleteComment)

export default router