import { Router } from 'express';
import { ProductManager } from '../managers/products.js';
import Product from '../models/Product.js';

const prodsRouter = Router();
const manager = new ProductManager();

prodsRouter.get('/', async (req, res) => {
    try {
        const { limit = 10, page = 1, sort, query } = req.query;
        const limitInt = parseInt(limit, 10);
        const pageInt = parseInt(page, 10);
        let filter = {};

        // Filtro de búsqueda
        if (query) {
            filter.$or = [
                { title: new RegExp(query, 'i') },
                { description: new RegExp(query, 'i') }
            ];
        }

        // Obtener productos filtrados
        let products = await Product.find(filter);

        // Ordenamiento
        if (sort) {
            const sortOrder = sort === 'asc' ? 1 : -1;
            products = products.sort((a, b) => (a.price - b.price) * sortOrder);
        }

        // Paginación
        const startIndex = (pageInt - 1) * limitInt;
        const endIndex = startIndex + limitInt;
        const paginatedProducts = products.slice(startIndex, endIndex);
        const totalPages = Math.ceil(products.length / limitInt);

        // Objeto de respuesta
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

prodsRouter.post('/', async (req, res) => {
    const { title, description, price, thumbnail, code, stock, category } = req.body;

    try {
        const confirmacion = await manager.getProductByCode(code);
        if (confirmacion) {
            return res.status(400).send("Producto ya existente");
        }
        const newProduct = await manager.addProduct(title, description, price, thumbnail, code, stock, category);
        res.send(newProduct);
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

prodsRouter.put('/:id', async (req, res) => {
    const { id } = req.params;
    const updatedProduct = req.body;
    const confirmacion = await manager.getProductById(id);

    if (confirmacion) {
        const result = await manager.updateProduct(id, updatedProduct);
        res.status(200).send(result);
    } else {
        res.status(404).send("Producto no encontrado");
    }
});

prodsRouter.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const confirmacion = await manager.getProductById(id);

    if (confirmacion) {
        await manager.removeProduct(id);
        res.status(200).send("producto eliminado");
    } else {
        res.status(404).send("producto no encontrado");
    }
});

export default prodsRouter;
