import { isValidObjectId } from 'mongoose';
import Cart from '../models/Cart.js';
import { CartDTO } from '../dtos/CartDTO.js';
import { productManager } from './productsDAO.js';

class CartManager {
    async getAllCarts() {
        const carts = await Cart.find().populate('products.product');
        return CartDTO.fromDocumentArray(carts);
    }

    async getCartById(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        return CartDTO.fromDocument(cart);
    }

    async saveCart(cartDTO) {
        const cartDocument = cartDTO.toDocument();
        const cart = new Cart(cartDocument);
        return await cart.save();
    }

    async createCart() {
        const newCart = new Cart();
        await newCart.save();
        return CartDTO.fromDocument(newCart);
    }

    async updateCart(cartId, products) {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            throw new Error('Cart not found');
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
            return CartDTO.fromDocument(populatedCart);
        } else {
            throw new Error('Product list not valid');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            throw new Error('Cart not found');
        }
        const product = await productManager.getProductById(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === productId);
        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }
        await cart.save();
        return CartDTO.fromDocument(cart);
    }

    async removeProductFromCart(cartId, productId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = cart.products.filter(p => {
            return p.product._id.toString() !== productId.toString();
        });
        await cart.save();
        return CartDTO.fromDocument(cart);
    }

    async updateProductQuantity(cartId, productId, quantity) {
        const cart = await Cart.findById(cartId).populate('products.product');
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
        return CartDTO.fromDocument(cart);
    }

    async clearCart(cartId) {
        const cart = await Cart.findById(cartId).populate('products.product');
        if (!cart) {
            throw new Error('Cart not found');
        }
        cart.products = [];
        await cart.save();
        return CartDTO.fromDocument(cart);
    }
}

export const CartDao = new CartManager();