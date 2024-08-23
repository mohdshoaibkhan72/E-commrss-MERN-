const mongoose = require("mongoose");

// Define the Product Schema
const ProductSchema = new mongoose.Schema({
  productId: {
    type: Number,
    required: true,
    trim: true,
    unique: true,
  },
  productName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 20,
  },
  productPrice: {
    type: Number,
    required: true,
    trim: true,
    min: 0,
  },
  productDescription: {
    type: String,
    required: true,
    trim: true,
    maxlength: 50,
  },
  productPhoto: {
    filename: {
      type: String,
      required: true,
    },
  },
});

// Create the Product model
const ProductModel = mongoose.model("Product", ProductSchema);

module.exports = ProductModel;
