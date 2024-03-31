const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description : {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    code: {
        type : String,
        require: true,
        unique: true
    },
    category: {
        type: String,
        require: true,
        unique: true
    },
    status: {
        type: Boolean,
        require: true
    },
    thumbnails: {
        type: [String],
    }
})

const ProductModel = mongoose.model ("products", productSchema);
module.exports = ProductModel;