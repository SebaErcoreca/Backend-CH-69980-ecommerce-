import User from '../models/User.js';
import { hashPassword } from '../utils/hash.js';

export const createUser = async (userData) => {
    const { first_name, last_name, email, age, password, cart, role } = userData;

    const hashedPassword = hashPassword(password);

    const newUser = new User({
        first_name,
        last_name,
        email,
        age,
        password: hashedPassword,
        cart,
        role
    });

    return await newUser.save();
};