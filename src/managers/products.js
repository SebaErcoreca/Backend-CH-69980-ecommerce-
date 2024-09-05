import Product from '../models/Product.js'
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export class ProductManager {
    async addProduct(title, description, price, thumbnail, code, stock, category) {
        const duplicateCode = await Product.findOne({ code });
        if (duplicateCode) {
            console.log('El código ya existe');
            return { success: false, message: "El código ya existe" };
        }
        const newProduct = new Product({ title, description, price, thumbnail, code, stock, category });
        try {
            await newProduct.save();
            console.log('Producto añadido correctamente');
            return { success: true, message: "Producto añadido correctamente", product: newProduct };
        } catch (error) {
            console.error('Error al guardar productos:', error.message);
            return { success: false, message: "Error al guardar productos" };
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
            return products;
        } catch (error) {
            console.error('Error al obtener productos:', error.message);
            return [];
        }
    }

    async removeProduct(id) {
        try {
            const product = await Product.findById(id);
            if (product) {
                product.status = false;
                await product.save();
                console.log('Producto eliminado correctamente');
            } else {
                console.log('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al eliminar producto:', error.message);
        }
    }

    async updateProduct(id, updatedProduct) {
        try {
            const product = await Product.findById(id);
            if (product) {
                Object.assign(product, updatedProduct);
                await product.save();
                console.log('Producto actualizado correctamente');
            } else {
                console.log('Producto no encontrado');
            }
        } catch (error) {
            console.error('Error al actualizar producto:', error.message);
        }
    }

    async getProductById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                return null;
            }
            const product = await Product.findById(id);
            return product || null;
        } catch (error) {
            console.error('Error al obtener producto:', error.message);
            return null;
        }
    }
    async getProductByCode(code) {
        try {
            const product = await Product.findOne({ code });
            return product || null;
        } catch (error) {
            console.error('Error al obtener producto por código:', error.message);
            return null;
        }
    }
}