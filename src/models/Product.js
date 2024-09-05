import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    price: Number,
    thumbnail: String,
    code: String,
    stock: Number,
    category: String,
    status: { type: Boolean, default: true }
});

const Product = mongoose.model('Product', productSchema);

export default Product;
