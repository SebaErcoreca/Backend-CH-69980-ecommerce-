import IUserRepository from './IUserRepository.js';
import UserDAO from '../daos/userDAO.js';

class UserRepository extends IUserRepository {
    constructor() {
        super();
        this.userDAO = new UserDAO();
    }

    async getUserById(id) {
        return await this.userDAO.getUserById(id);
    }

    async createUser(userData) {
        return await this.userDAO.createUser(userData);
    }

    async updateUser(id, userData) {
        return await this.userDAO.updateUser(id, userData);
    }

    async deleteUser(id) {
        return await this.userDAO.deleteUser(id);
    }
}

export default UserRepository;