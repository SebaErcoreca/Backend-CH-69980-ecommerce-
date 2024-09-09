import User from '../models/User.js';
import { hashPassword } from '../utils/hash.js';
import UserDTO from '../dtos/UserDTO.js';

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

    await newUser.save();

    return new UserDTO({
        first_name: newUser.first_name,
        last_name: newUser.last_name,
        email: newUser.email,
        age: newUser.age,
        role: newUser.role
    });
};