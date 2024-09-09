import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { ProductDTO } from '../dtos/ProductDTO.js';
const { ObjectId } = mongoose.Types;
class ProductManager {
    async addProduct(title, description, price, thumbnail, code, stock, category) {
        const duplicateCode = await Product.findOne({ code });
        if (duplicateCode) {
            console.log('Code already exists');
            return { success: false, message: "Code already exists" };
        }
        const newProduct = new Product({ title, description, price, thumbnail, code, stock, category });
        try {
            await newProduct.save();
            console.log('Product added successfully');
            return { success: true, message: "Product added successfully", product: ProductDTO.fromProduct(newProduct) };
        } catch (error) {
            console.error('Error', error.message);
            return { success: false, message: "Error" };
        }
    }

    async getProducts({ limit = 10, page = 1, sort = 'asc' } = {}) {
        try {
            const sortOrder = sort === 'asc' ? 1 : -1;
            const skip = (page - 1) * limit;
            const products = await Product.find({ status: true })
                .sort({ price: sortOrder })
                .skip(skip)
                .limit(limit);
            return products.map(product => ProductDTO.fromProduct(product));
        } catch (error) {
            console.error('Error', error.message);
            return [];
        }
    }

    async removeProduct(id) {
        try {
            const product = await Product.findById(id);
            if (product) {
                product.status = false;
                await product.save();
                console.log('Product deleted successfully');
            } else {
                console.log('Product deleted successfully');
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = await Product.findById(id);
            if (product) {
                Object.assign(product, updatedProduct);
                await product.save();
                console.log('Product updated successfully');
            } else {
                console.log('Product not found');
            }
        } catch (error) {
            console.error('Error', error.message);
        }
    }

    async getProductById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                return null;
            }
            const product = await Product.findById(id);
            return product ? ProductDTO.fromProduct(product) : null;
        } catch (error) {
            console.error('Error', error.message);
            return null;
        }
    }

    async getProductByCode(code) {
        try {
            const product = await Product.findOne({ code });
            return product ? ProductDTO.fromProduct(product) : null;
        } catch (error) {
            console.error('Error', error.message);
            return null;
        }
    }
}

export const productManager = new ProductManager();