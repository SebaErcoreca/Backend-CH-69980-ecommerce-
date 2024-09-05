import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const secret = process.env.JWT_SECRET
const expiresIn = '1h';

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email, role: user.role }, secret, { expiresIn });
};

export const verifyToken = (token) => {
    return jwt.verify(token, secret);
};