import express from 'express';
import { createFlag, getFlags, evaluateFlags, updateFlag, deleteFlag, getAnalytics } from '../controllers/flag.js';


const router = express.Router();

router.post('/', createFlag);
router.get('/', getFlags);
router.get('/evaluate', evaluateFlags);
router.patch('/:id', updateFlag);
router.delete('/:id', deleteFlag);
router.get('/analytics', getAnalytics);

export default router;