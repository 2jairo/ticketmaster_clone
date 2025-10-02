import { Router } from 'express'
import { createConcert, getConcertDetails, getConcerts } from '../controllers/concert'

const router = Router()

router.get('/concerts', getConcerts)
router.get('/concert-details/:slug', getConcertDetails)
router.post('/concert', createConcert)


export default router