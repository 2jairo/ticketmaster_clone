import { Router } from 'express'
import { createConcert, createMultipleConcerts, getConcertDetails, getConcerts } from '../controllers/concert'

const router = Router()

router.get('/concerts', getConcerts)
router.get('/concert-details/:slug', getConcertDetails)
router.post('/concert', createConcert)
router.post('/concerts', createMultipleConcerts)


export default router