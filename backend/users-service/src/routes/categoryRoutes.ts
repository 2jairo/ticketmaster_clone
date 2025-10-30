import { Router } from 'express'
import { createCategory, getCategories, getCategoriesTitle } from '../controllers/categories'

const router = Router()

router.get('/categories', getCategories)
router.get('/categories-title', getCategoriesTitle)
router.post('/category', createCategory)


export default router