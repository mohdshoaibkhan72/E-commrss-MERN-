const OrderModel = require("../Models/Ordermodel");

const AddOrder = async (req, res) => {
  try {
    const { userName, TotalPrice, Address, MobNumber, paymentId, items } =
      req.body;

    // Validate required fields
    if (
      !userName ||
      !TotalPrice ||
      !Address ||
      !MobNumber ||
      !paymentId ||
      !items ||
      items.length === 0
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Optionally: Validate field formats (e.g., phone number, total price, etc.)
    // Example: if (!/^[0-9]{10}$/.test(MobNumber)) { ... }

    // Create a new order instance
    const orderSave = new OrderModel({
      userName,
      TotalPrice,
      Address,
      MobNumber,
      paymentId,
      items,
    });

    // Save the order to the database
    await orderSave.save();
    res.status(200).json({ message: "Order added successfully" });
  } catch (error) {
    console.error("Error saving order:", error);
    res
      .status(500)
      .json({ message: "An error occurred while adding the order" });
  }
};

module.exports = AddOrder;
