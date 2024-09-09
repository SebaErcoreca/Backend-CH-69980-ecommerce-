import { productManager } from "../daos/productsDAO.js";

class ProductRepository {
    constructor() {
    }

    async getProductById(id) {
        return await productManager.getProductById(id);
    }

    async addProduct(title, description, price, thumbnail, code, stock, category) {
        return await productManager.addProduct(title, description, price, thumbnail, code, stock, category);
    }

    async updateProduct(id, updatedProduct) {
        return await productManager.updateProduct(id, updatedProduct);
    }

    async removeProduct(id) {
        return await productManager.removeProduct(id);
    }

    async getProducts(queryParams) {
        return await productManager.getProducts(queryParams);
    }

    async getProductByCode(code) {
        return await productManager.getProductByCode(code);
    }
}

export default ProductRepository;