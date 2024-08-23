const ProductModel = require("../Models/productmodel");

// Add Product
const AddProduct = async (req, res) => {
  try {
    const { productId, productName, productPrice, productDescription } =
      req.body;
    const file = req.file;

    // Validation
    if (
      !productId ||
      !productName ||
      !productPrice ||
      !productDescription ||
      !file
    ) {
      return res
        .status(400)
        .send({ success: false, message: "Please provide all fields" });
    }

    // Save product
    const productSave = new ProductModel({
      productId,
      productName,
      productPrice,
      productDescription,
      productPhoto: {
        filename: file.filename,
      },
    });

    await productSave.save();
    res
      .status(200)
      .send({ success: true, message: "Product saved in database" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .send({ success: false, message: "Some internal error occurred" });
  }
};
// Get Products
const Getproduct = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.status(200).json({ success: true, products });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Internal server error at backend" });
  }
};
// Update Product
const UpdateProduct = async (req, res) => {
  try {
    const { productId, productName, productPrice, productDescription } =
      req.body;

    if (!productId || !productName || !productPrice || !productDescription) {
      return res
        .status(400)
        .json({ success: false, message: "Please provide all fields" });
    }

    // Check if the product exists
    const existingProduct = await ProductModel.findOne({ productId });
    if (!existingProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update the product fields
    existingProduct.productName = productName;
    existingProduct.productPrice = productPrice;
    existingProduct.productDescription = productDescription;

    // Save the updated product to the database
    await existingProduct.save();
    res
      .status(200)
      .json({ success: true, message: "Product updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
// Delete Product
const Deleteproduct = async (req, res) => {
  try {
    const { productId } = req.params;

    if (!productId) {
      return res
        .status(400)
        .json({ success: false, message: "Product ID is required" });
    }

    const deletedProduct = await ProductModel.findOneAndDelete({ productId });

    if (deletedProduct) {
      res
        .status(200)
        .send({ success: true, message: "Product deleted successfully" });
    } else {
      res.status(404).send({ success: false, message: "Product not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: "Internal server error" });
  }
};

module.exports = { AddProduct, Deleteproduct, Getproduct, UpdateProduct };
