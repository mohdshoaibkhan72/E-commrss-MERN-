const express = require("express");
const connectDB = require("./config/DbConnection");
const cors = require("cors");
const multer = require("multer");

// Controllers
const { registerUser, login } = require("./controllers/auth.user");
const {
  AddProduct,
  Getproduct,
  UpdateProduct,
  Deleteproduct,
} = require("./controllers/product.api");
const Chngepswd = require("./controllers/chnagepswd");
const {
  Addcard,
  GetCartItems,
  DelCartItems,
} = require("./controllers/card.api");
const AddOrder = require("./controllers/creatorder");

// Middleware
const checkAuthMiddle = require("./middlewares/checkAuthMiddleware");
const upload = multer({ dest: "images/" });

// Initialize Express App
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Enable CORS
app.use(cors());

// Connect to the database
connectDB();

// User Registration & Login Routes
app.post("/register", registerUser);
app.post("/login", login);

// Product Routes
app.post("/addproduct", upload.single("file"), AddProduct);
app.get("/getproducts", Getproduct);
app.put("/updateProduct/:productId", checkAuthMiddle, UpdateProduct);
app.delete("/deleteproduct/:productId", checkAuthMiddle, Deleteproduct);

// Serve static files from "images/" directory
app.use("/images", express.static("images/"));

// Password Change Routes
app.put("/changePassword", checkAuthMiddle, Chngepswd);

// Shopping Cart Routes
app.post("/addcard", Addcard);
app.get("/getcart", GetCartItems);
app.delete("/deletecart", DelCartItems);

// Order Routes
app.post("/addorder", AddOrder);

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ success: false, message: "Internal Server Error" });
});

// Start the server on port 8000
app.listen(8000, () => {
  console.log("Server is running on port 8000");
});
