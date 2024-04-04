const express = require("express");
const router = express.Router();
const CartManager = require("../controllers/CartManager.js");
const cartManager = new CartManager();
const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager();
 
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

    const newArray = products.docs.map(product => {
      const { _id, ...rest } = product.toObject();
      return rest;
    });

    res.render("products", {
      products: newArray,
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
    const cart = await cartManager.getCartById(cartId);

    if (!cart) {
      console.log("Doesn't exist cart with this ID");
      return res.status(404).json({ error: "Cart not found" });
    }

    const productInCart = cart.products.map(item => ({
      product: item.product.toObject(),
      quantity: item.quantity
    }));

    res.render("carts", { products: productInCart });
  } catch (error) {
    console.error("Error to obtain the cart", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/register", (req, res) => {
  if(req.session.login) {
      return res.redirect("/profile");
  }
  res.render("register");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/profile", (req, res) => {
  if (!req.session.login) {
      return res.redirect("/login");
  }
  res.render("profile", { user: req.session.user })
});

export default router;

module.exports = router;