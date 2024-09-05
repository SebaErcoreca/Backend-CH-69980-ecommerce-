import express from 'express';
import { createUser } from '../managers/user.js';

const userRouter = express.Router();
userRouter.post('/', async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(200).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        res.status(404).json({ error: 'Error al crear el usuario' });
    }
});

export default userRouter;