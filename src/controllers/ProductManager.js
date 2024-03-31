const ProductsModel = require("../models/product.model.js")

class ProductManager {
    async addProduct({ title, description, price, img, code, stock, category }) {
        try {
            if (!title || !description || !price || !code || !stock || !category) {
                console.log("All fields are mandatory");
                return;
            }

            const productExiste = await ProductsModel.findOne({ code: code })

            if (productExiste) {
                console.log("Code must be unique")
                return;
            }

            const newProduct = new ProductsModel({
                title,
                description,
                price,
                img,
                code,
                stock,
                category,
                status: true,
            });

            await newProduct.save();

        } catch (error) {
            console.log("Error to add product", error);
            throw error;
        }
    }

    async getProduct() {
        try {
            const products = await ProductsModel.find();
            return products;

        } catch (error) {
            console.log("Error to get products", error);
        }
    }

    async getProductById(id) {
        try {
            const product = await ProductsModel.findById(id);

            if (!product) {
                console.log("Product no found");
                return null;
            } else {
                console.log("Product found");
                return product;
            }
        } catch (error) {
            console.log("Error to obtain product by ID", error);
            throw error;
        }
    }

    async updatedProduct(id, productUpdated) {
        try {

            const updatedProduct = await ProductsModel.findByIdAndUpdate(id, productUpdated);

            if (!updatedProduct) {
                console.log("Product not found");
                return null;
            }

            console.log("product updated");
            return updatedProduct;

        } catch (error) {
            console.log("Error to update product", error);
            throw error;
        }
    }

    async deleteProduct(id) {
        try {

            const deleteProduct = await ProductsModel.findByIdAndDelete(id);

            if (!deleteProduct) {
                console.log("Product not found");
                return null;
            }

            console.log("product deleted");

        } catch (error) {
            console.log("Error to delete product", error);
            throw error;
        }
    }
}

module.exports = ProductManager;