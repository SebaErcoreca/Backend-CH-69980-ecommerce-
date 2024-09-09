import { Router } from "express";
import { productManager } from "../daos/productsDAO.js";
import { CartDao } from "../daos/CartDao.js";

const viewsRouter = Router();

viewsRouter.get('/', async (req, res) => {
    try {
        const limit = parseInt(req.query.limit) || 10;
        const page = parseInt(req.query.page) || 1;
        const sort = req.query.sort || 'asc';
        const products = await productManager.getProducts({ limit, page, sort });

        if (!products || products.length === 0) {
            res.status(404).render('home', { error: "No products available" });
        } else {
            res.render('home', { products });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

viewsRouter.get('/products/:pid', async (req, res) => {
    try {
        const { pid } = req.params;
        const product = await productManager.getProductById(pid);

        if (!product) {
            return res.status(404).json({ message: "No products available" });
        }
        res.render('products', { product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

viewsRouter.get("/carts/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await CartDao.getCartById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        const { productId, quantity } = req.body;
        if (productId && quantity) {
            const updatedCart = await CartDao.addProductToCart(cid, productId, quantity);
            res.render("carts", { cart: updatedCart });
        }
        res.render("carts", { cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

viewsRouter.get('/realtimeproducts/', async (req, res) => {
    const products = await productManager.getProducts();

    if (!products || products.length === 0) {
        throw new Error("No products available", 404);
    } else {
        res.render('realTimeProducts', { products });
    }
});

export default viewsRouter