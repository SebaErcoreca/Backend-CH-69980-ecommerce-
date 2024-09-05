import express from 'express';
import { authenticateToken } from '../middleware/auth.js';

const protectedRouter = express.Router();

// Ruta protegida
protectedRouter.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'Acceso a ruta protegida exitoso' });
});

export default protectedRouter;
