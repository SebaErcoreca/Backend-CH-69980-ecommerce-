import { Router } from 'express';
import { productManager as manager } from '../daos/productsDAO.js';
import Product from '../models/Product.js';
import authorizeRole from '../middleware/guard.auth.js';

const prodsRouter = Router();

prodsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const limitInt = parseInt(limit, 10);
        const pageInt = parseInt(page, 10);
        let filter = {};

        if (query) {
            filter.$or = [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ];
        }

        let products = await Product.find(filter);

        if (sort) {
            const sortOrder = sort === 'asc' ? 1 : -1;
            products = products.sort((a, b) => (a.price - b.price) * sortOrder);
        }

        const startIndex = (pageInt - 1) * limitInt;
        const endIndex = startIndex + limitInt;
        const paginatedProducts = products.slice(startIndex, endIndex);
        const totalPages = Math.ceil(products.length / limitInt);

        const response = {
            status: 'success',
            payload: paginatedProducts,
            totalPages: totalPages,
            prevPage: pageInt > 1 ? pageInt - 1 : null,
            nextPage: pageInt < totalPages ? pageInt + 1 : null,
            page: pageInt,
            hasPrevPage: pageInt > 1,
            hasNextPage: pageInt < totalPages,
            prevLink: pageInt > 1 ? `/api/products?limit=${limitInt}&page=${pageInt - 1}&sort=${sort}&query=${query}` : null,
            nextLink: pageInt < totalPages ? `/api/products?limit=${limitInt}&page=${pageInt + 1}&sort=${sort}&query=${query}` : null
        };

        res.json(response);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

prodsRouter.get('/:id', async (req, res) => {
    res.send(await manager.getProductById(req.params.id));
});

prodsRouter.post('/', authorizeRole('admin'), async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    try {
        const confirmation = await manager.getProductByCode(code);
        if (confirmation) {
            return res.status(400).send("Product already exists");
        }
        const newProduct = await manager.addProduct(title, description, price, thumbnail, code, stock, category);
        res.send(newProduct);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

prodsRouter.put('/:id', authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const confirmation = await manager.getProductById(id);

    if (confirmation) {
        const result = await manager.updateProduct(id, updatedProduct);
        res.status(200).send(result);
    } else {
        res.status(404).send("Product not found");
    }
});

prodsRouter.delete('/:id', authorizeRole('admin'), async (req, res) => {
    const { id } = req.params;
    const confirmation = await manager.getProductById(id);

    if (confirmation) {
        await manager.removeProduct(id);
        res.status(200).send("Product deleted successfully");
    } else {
        res.status(404).send("Product not found");
    }
});

export default prodsRouter;