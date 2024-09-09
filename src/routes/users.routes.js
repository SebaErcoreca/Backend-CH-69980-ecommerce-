import express from 'express';
import { createUser } from '../daos/userDAO.js';

const userRouter = express.Router();
userRouter.post('/', async (req, res) => {
    try {
        const newUser = await createUser(req.body);
        res.status(200).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
        res.status(404).json({ error: 'Error' });
    }
});

export default userRouter;