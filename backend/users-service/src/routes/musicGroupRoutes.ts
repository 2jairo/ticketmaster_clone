import { Router } from 'express'
import { createMultipleMusicGropus, createMusicGroup, getMusicGroupDetails, getMusicGroups } from '../controllers/musicGroups'

const router = Router()

router.get('/', getMusicGroups)
router.get('/:slug', getMusicGroupDetails)
router.post('/', createMusicGroup)
router.post('/multiple', createMultipleMusicGropus)

export default router