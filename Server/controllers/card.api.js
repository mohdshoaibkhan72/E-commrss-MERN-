const CartItem = require("../Models/Cardmodel");

// Add an item to the cart
const Addcard = async (req, res) => {
  try {
    const { productName, productPrice, quantity, user, productId } = req.body;

    // Validate required fields
    if (!productName || !productPrice || !user || !productId) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Check if a cart item already exists for the user and product
    const existingCartItem = await CartItem.findOne({ productId, user });

    if (existingCartItem) {
      return res
        .status(400)
        .json({ success: false, message: "Item already added to the cart" });
    }

    // Create a new cart item
    const newCartItem = new CartItem({
      user,
      productId,
      productName,
      productPrice,
      quantity: quantity || 1, // Default to 1 if quantity is not provided
    });

    // Save the new cart item to the database
    await newCartItem.save();

    // Respond with a success message
    res
      .status(201)
      .json({ success: true, message: "Cart item stored successfully" });
  } catch (error) {
    console.log(error);
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Delete an item from the cart
const DelCartItems = async (req, res) => {
  try {
    const { _id } = req.body;

    if (!_id) {
      return res
        .status(400)
        .json({ success: false, message: "Item ID is required" });
    }

    // Delete the item from the cart
    const deletedItem = await CartItem.findByIdAndDelete(_id);

    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    // Respond with the deleted item
    res.status(200).json({ success: true, data: deletedItem });
  } catch (error) {
    console.error("Error deleting item from cart:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Get all items in the cart
const GetCartItems = async (req, res) => {
  try {
    const cartItems = await CartItem.find();

    res.status(200).json({ success: true, data: cartItems });
  } catch (error) {
    console.error("Error fetching cart items:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  Addcard,
  DelCartItems,
  GetCartItems,
};
