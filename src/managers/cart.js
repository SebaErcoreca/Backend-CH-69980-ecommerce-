import { isValidObjectId } from 'mongoose';
import Cart from '../models/Cart.js';
import { ProductManager } from './products.js';

const productManager = new ProductManager();

class CartManager {
    async getAllCarts() {
        return await Cart.find().populate('products.product');
    }

    async clearAllCarts() {
        await Cart.updateMany({}, { $set: { products: [] } });
    }

    async getCartById(cartId) {
        return await Cart.findById(cartId).populate('products.product');
    }

    async saveCart(cart) {
        return await cart.save();
    }

    async createCart() {
        const newCart = new Cart();
        newCart.save()
        return newCart;
    }

    async updateCart(cartId, products) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        if (Array.isArray(products) && products.every(p => isValidObjectId(p.productId) && typeof p.quantity === 'number')) {
            const productUpdates = await Promise.all(products.map(async ({ productId, quantity }) => {
                const product = await productManager.getProductById(productId);
                return product ? { product: product._id, quantity } : null;
            }));
            const validProducts = productUpdates.filter(p => p !== null);
            cart.products = validProducts;
            await cart.save();
            const populatedCart = await Cart.findById(cartId).populate('products.product').exec();
            return populatedCart;
        } else {
            throw new Error('La lista de productos proporcionada no es válida.');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error('Producto no encontrado');
        }
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        return cart;
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        cart.products = cart.products.filter(p => {
            return p.product._id.toString() !== productId.toString();
        });
        await this.saveCart(cart);
        await cart.populate('products.product');
        return cart;
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId);
        if (!cart) {
            throw new Error('Cart not found');
        }
        const productIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (productIndex > -1) {
            cart.products[productIndex].quantity = quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        await cart.populate('products.product');
        return cart;
    }

    async clearCart(cartId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error('Carrito no encontrado');
        }
        cart.products = [];
        await this.saveCart(cart);
        return cart.populate('products.product').execPopulate();
    }
}

export const cartManager = new CartManager();