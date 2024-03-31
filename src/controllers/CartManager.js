const CartModel = require("../models/cart.model.js")
class CartManager {

    async createCart() {
        try {
            const newCart = new CartModel({ products: [] });
            await newCart.save();
            return newCart;

        } catch (error) {
            console.log("Error to create cart", error);
            throw error;
        }
    }

    async getCartById(cartId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error(`ID ${cartId} cart doesn't exist`)
            }

            return cart;

        } catch (error) {
            console.error("Error to optain cart by ID", error);
            throw error;
        }
    }

    async addProductToCart(cartId, productId, quantity = 1) {
        try {
            const cart = await this.getCartById(cartId);
            const existProduct = cart.products.find(item => item.product.toString() === productId);

            if (existProduct) {
                existProduct.quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity });
            }

            cart.markModified("products");

            await cart.save();
            return cart;

        } catch (error) {
            console.error("Error to add product", error);
            throw error;
        }
    }

    async eliminarProductoDelCarrito(cartId, productId) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.products = cart.products.filter(item => item.product._id.toString() !== productId);

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error while deleting product from cart', error);
            throw error;
        }
    }
    
    async actualizarCarrito(cartId, updatedProducts) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            cart.products = updatedProducts;

            cart.markModified('products');

            await cart.save();

            return cart;
        } catch (error) {
            console.error('Error to update the cart in the administrator', error);
            throw error;
        }
    }

    async actualizarCantidadDeProducto(cartId, productId, newQuantity) {
        try {
            const cart = await CartModel.findById(cartId);

            if (!cart) {
                throw new Error('Cart not found');
            }

            const productIndex = cart.products.findIndex(item => item.product._id.toString() !== productId);

            if (productIndex !== -1) {
                cart.products[productIndex].quantity = newQuantity;

                cart.markModified('products');

                await cart.save();
                return cart;
            } else {
                throw new Error('Product not found in the cart');
            }
        } catch (error) {
            console.error('Error to upload product qty to cart', error);
            throw error;
        }
    }

    async vaciarCarrito(cartId) {
        try {
            const cart = await CartModel.findByIdAndUpdate(
                cartId,
                { products: [] },
                { new: true }
            );

            if (!cart) {
                throw new Error('Cart not found');
            }

            return cart;
        } catch (error) {
            console.error('Error to empty the cart in the administrator', error);
            throw error;
        }
    }
}

module.exports = CartManager;