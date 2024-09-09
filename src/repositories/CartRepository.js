import { CartDao } from '../daos/CartDao.js';

class CartRepository {
    constructor() {
    }

    async getAllCarts() {
        return await CartDao.getAllCarts();
    }

    async getCartById(cartId) {
        return await CartDao.getCartById(cartId);
    }

    async removeProductFromCart(cartId, productId) {
        return await CartDao.removeProductFromCart(cartId, productId);
    }

    async updateCart(cartId, products) {
        return await CartDao.updateCart(cartId, products);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        return await CartDao.updateProductQuantity(cartId, productId, quantity);
    }

    async addProductToCart(cartId, productId, quantity) {
        return await CartDao.addProductToCart(cartId, productId, quantity);
    }

    async createCart() {
        return await CartDao.createCart();
    }

    async clearAllCarts() {
        return await CartDao.clearCart();
    }
}

export default CartRepository;