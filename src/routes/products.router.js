const express = require("express");
const router = express.Router();

const ProductManager = require("../controllers/ProductManager.js");
const productManager = new ProductManager()

// const products = []
// router.get("/", async (req, res) => {
//     try {
//         const limit = req.query.limit;
//         const products = await productManager.getProduct()
//         if (limit) {
//             res.json(products.slice(0,limit));
//         } else {
//             res.json(products)
//         }
//     } catch (error) {
//         res.status(500).json({error: "internal server error"})
//     }
// })

router.get("/", async (req, res) => {
    try {
        const {limit = 10, page = 1, sort, query } = req. query;
        const products = await productManager.getProduct ({
            limit: parseInt (limit),
            page: parseInt(page),
            sort,
            query,
        });

        res.json({
            status: 'success',
            payload: products,
            totalPages: products.totalPages,
            prevPage: products.prevPage,
            nextPage: products.nextPage,
            page: products.page,
            hasPrevPage: products.hasPrevPage,
            hasNextPage: products.hasNextPage,
            prevLink: products.hasPrevPage ? `/api/products?limit=${limit}&page=${productos.prevPage}&sort=${sort}&query=${query}` : null,
            nextLink: products.hasNextPage ? `/api/products?limit=${limit}&page=${productos.nextPage}&sort=${sort}&query=${query}` : null,
        });

    } catch (error) {
        console.error("Error al obtener productos", error);
        res.status(500).json({
            status: 'error',
            error: "Error interno del servidor"
        });
    }
})

router.get("/:pid", async (req, res) => {
     const id = req.params.pid;

    try {
        const product = await productManager.getProductById (id);
        if (!product) {
            return res.json({error: "ID not found"});
        }

        res.json(product);
    } catch (error) {
        res.status(500).json({error:"Interal server error"})
    }
})

router.post("/", (req, res) => {
    
    const newProduct = req.body;

    const postProduct = productManager.addProduct (newProduct)

    products.push(newProduct);
    
    res.send({status:"succes", message: "Product added correctly"});
})

router.put("/:pid", async (req, res) => {
    const id = req.params.pid;
    const  updatedProduct = req.body;

    try {
        await productManager.updatedProduct(id, updatedProduct)
        res.json ({
            message: "Product updated succesfully"
        });
    } catch (error) {
        res.status(500).json ({
            error: "Internal server error"
        });
    }
});

router.delete("/:pid", async (req, res) => {
    const id = req.params.pid;

    try {
        await productManager.deleteProduct(id);
        
        res.json ({
            message: "Product deleted succesfully"
        });
    } catch (error) {
        res.status(500).json ({
            error: "Internal server error"
        });
    }
});

module.exports = router;
