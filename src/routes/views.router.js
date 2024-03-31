const express = require("express");
const router = express.Router();

const CartManager = require("../controllers//CartManager.js");
const cartManager = new CartManager();
const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager();

// router.get("/", async (req, res) => {
//     try {
//       const products = await productManager.getProduct();

//       res.render("home", {products: products} );
//     } catch (error) {
//       console.log("Error al recuperar productos", error);

//       res.status(500).json({error: "Error interno del servidor"})
//     }
//   });
  
router.get("/realTimeProducts", async (req, res) => {
  try {
    res.render("realTimeProducts");
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

router.get("/", async (req, res) => {
  res.render("chat");
});

router.get("/products", async (req, res) => {
  try {
    const { page = 1, limit = 2 } = req.query;
    const products = await productManager.getProduct({
      page: parseInt(page),
      limit: parseInt(limit)
    });

    const nuevoArray = products.docs.map(product => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });

    res.render("products", {
      productos: nuevoArray,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      currentPage: products.page,
      totalPages: products.totalPages
    });
  } catch (error) {
    console.error("Error to obtain products", error);
    res.status(500).json({
      status: 'error',
      error: "Internal server error"
    });
  }
});

router.get("/carts/:cid", async (req, res) => {
  const cartId = req.params.cid;

  try {
    const cart = await cartManager.getCarritoById(cartId);

    if (!cart) {
      console.log("Doesn't exist cart with this ID");
      return res.status(404).json({ error: "Cart not found" });
    }

    const productosEnCarrito = carrito.products.map(item => ({
      product: item.product.toObject(),
      quantity: item.quantity
    }));

    res.render("carts", { products: productosEnCarrito });
  } catch (error) {
    console.error("Error to obtain the cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;