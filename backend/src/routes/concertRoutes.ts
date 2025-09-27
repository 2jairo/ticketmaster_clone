import { Router } from 'express'
import { createConcert, getConcerts } from '../controllers/concert'

const router = Router()

router.get('/concerts', getConcerts)
router.post('/concert', createConcert)


export default router