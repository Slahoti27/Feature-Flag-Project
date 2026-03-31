import express from 'express';
import { createFlag, getFlags, evaluateFlags, updateFlag, deleteFlag } from '../controllers/flag.js';


const router = express.Router();

router.post('/', createFlag);
router.get('/', getFlags);
router.get('/evaluate', evaluateFlags);
router.patch('/:id', updateFlag);
router.delete('/:id', deleteFlag);

export default router;