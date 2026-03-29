import express from 'express';
import authRoutes from './auth.routes'
import shortUrlRoutes from './short-url.routes'

const router = express.Router()

router.use('/auth', authRoutes);
router.use('/short-url', shortUrlRoutes);

export default router;
