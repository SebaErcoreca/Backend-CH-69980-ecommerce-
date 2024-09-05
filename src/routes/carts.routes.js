import express from 'express';
import { cartManager } from '../managers/cart.js';

const cartsRouter = express.Router();

cartsRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getAllCarts();
        res.json(carts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
    try {
        const cart = await cartManager.removeProductFromCart(req.params.cid, req.params.pid);
        res.json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.put('/:cid', async (req, res) => {
    try {
        const updatedCart = await cartManager.updateCart(req.params.cid, req.body.products);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.put('/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).json({ error: 'Cantidad no válida' });
    }
    try {
        const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
        res.json(updatedCart);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const updatedCart = await cartManager.addProductToCart(cid, pid, req.body.quantity || 1);
        res.json(updatedCart);
    } catch (error) {
        console.error('Error al agregar producto al carrito:', error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.post('/', async (req, res) => {
    try {
        const createdCart = await cartManager.createCart();
        res.json(createdCart);
    } catch (error) {
        console.error('Error al crear carrito:', error);
        res.status(500).json({ error: error.message });
    }
});

cartsRouter.delete('/', async (req, res) => {
    try {
        await cartManager.clearAllCarts();
        res.json({ message: 'Todos los productos han sido eliminados de todos los carritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

export default cartsRouter;
