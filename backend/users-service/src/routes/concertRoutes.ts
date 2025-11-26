import { Router } from 'express'
import { getConcertDetails, getConcerts } from '../controllers/concert'
import { verifyJWTOptional } from '../middleware/auth'

const router = Router()

router.get('/concerts', getConcerts)
router.get('/concert-details/:slug', verifyJWTOptional, getConcertDetails)


export default router