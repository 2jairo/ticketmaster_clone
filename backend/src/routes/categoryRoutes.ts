import { Router } from 'express'
import { createCategory, getCategories } from '../controllers/categories'

const router = Router()

router.get('/categories', getCategories)
router.post('/category', createCategory)


export default router