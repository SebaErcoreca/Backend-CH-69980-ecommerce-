import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const protectedRouter = express.Router();

protectedRouter.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Successful Protected Path Access' });
});

export default protectedRouter;
