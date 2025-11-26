import { Router } from 'express'
import { getCategories, getCategoriesTitle } from '../controllers/categories'

const router = Router()

router.get('/categories', getCategories)
router.get('/categories-title', getCategoriesTitle)


export default router