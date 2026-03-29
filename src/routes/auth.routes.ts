import express from 'express';
import { createUser, login } from '../controllers/user.controller';
import { auth } from '../middlewares/authMiddleware';

const router = express.Router();

router.post('/register', auth,createUser);
router.post('/login', login);

export default router;