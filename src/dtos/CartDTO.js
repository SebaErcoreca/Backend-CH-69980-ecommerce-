import mongoose from 'mongoose';
export class CartDTO {
    constructor(cart) {
        this.id = cart._id || cart.id;
        this.products = cart.products.map(product => ({
            productId: product.product._id || product.product.id,
            quantity: product.quantity,
        }));
        this.createdAt = cart.createdAt;
        this.updatedAt = cart.updatedAt;
    }

    static fromDocument(cartDocument) {
        if (!cartDocument) return null;
        return new CartDTO(cartDocument);
    }

    static fromDocumentArray(cartDocuments) {
        return cartDocuments.map(cartDoc => new CartDTO(cartDoc));
    }

    toDocument() {
        return {
            products: this.products.map(p => ({
                product: mongoose.Types.ObjectId(p.productId),
                quantity: p.quantity
            })),
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        };
    }
}