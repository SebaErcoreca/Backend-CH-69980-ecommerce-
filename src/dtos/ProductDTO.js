export class ProductDTO {
    constructor(product) {
        this.id = product._id.toString();
        this.title = product.title;
        this.description = product.description;
        this.price = product.price;
        this.thumbnail = product.thumbnail;
        this.code = product.code;
        this.stock = product.stock;
        this.category = product.category;
        this.status = product.status;
    }

    static fromProduct(product) {
        return new ProductDTO(product);
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            description: this.description,
            price: this.price,
            thumbnail: this.thumbnail,
            code: this.code,
            stock: this.stock,
            category: this.category,
            status: this.status
        };
    }
}