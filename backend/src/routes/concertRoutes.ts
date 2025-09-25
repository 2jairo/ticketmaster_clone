import { Router } from 'express'
import { getAllConcerts } from '../controllers/concert'

const router = Router()

router.get('/concerts', getAllConcerts)


export default router