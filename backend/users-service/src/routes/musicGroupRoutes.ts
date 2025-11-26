import { Router } from 'express'
import { getMusicGroupDetails, getMusicGroups } from '../controllers/musicGroups'

const router = Router()

router.get('/', getMusicGroups)
router.get('/:slug', getMusicGroupDetails)

export default router