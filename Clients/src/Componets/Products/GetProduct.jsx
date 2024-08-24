import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../../Context";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { Button } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const { accountType } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://e-commers-ury8.onrender.com/getproducts"
        );
        setProducts(response.data.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        toast.error("Failed to fetch products");
      }
    };

    fetchData();
  }, []);

  const handleAddToCart = async (
    productId,
    productPrice,
    productName,
    filename
  ) => {
    try {
      // Get the user information from localStorage
      const user = localStorage.getItem("user");

      // Fetch the user's cart items
      const responseGetCart = await axios.get(
        "https://e-commers-ury8.onrender.com/getcart"
      );
      const userCart = responseGetCart.data.data;

      // Check if the product is already in the cart
      const isProductInCart = userCart.some(
        (item) => item.productId === productId
      );

      if (isProductInCart) {
        toast.info("Already added to cart");
        return;
      }

      // Add the product to the cart if it's not already there
      const responseAddToCart = await axios.post(
        "https://e-commers-ury8.onrender.com/addcard",
        {
          productId,
          productPrice,
          productName,
          filename,
          user,
        }
      );

      if (responseAddToCart.data.success) {
        setCart((prevCart) => [
          ...prevCart,
          { productId, productPrice, productName, filename },
        ]);
        toast.success("Item added to cart");
      } else {
        toast.error("Failed to add item to cart");
      }
    } catch (error) {
      console.error("Error adding product to the cart:", error);
      toast.error("Alllredy added || some error");
    }
  };

  const handleDeleteButton = async (productId) => {
    try {
      const response = await axios.delete(
        `https://e-commers-ury8.onrender.com/deleteproduct/${productId}`
      );

      if (response.status === 200) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.productId !== productId)
        );
        toast.success("Product deleted successfully");
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("An error occurred while deleting the product");
    }
  };

  const handleUpdateButton = (productId) => {
    const selectedProduct = products.find(
      (product) => product.productId === productId
    );
    navigate(`/updateProduct/${productId}`, {
      state: { product: selectedProduct },
    });
  };

  return (
    <>
      <ToastContainer />
      <div className="cards">
        <div className="card-container">
          {products.map((product) => (
            <div key={product.productId} className="card cardbox">
              <div>
                <img
                  src={product.productPhoto.filename}
                  alt={product.productName}
                  className="card-img-top"
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{product.productName}</h5>
                <p className="card-text">{product.productDescription}</p>
                <p className="card-text">Price: ${product.productPrice}</p>
                <button
                  className="btn btn-primary"
                  onClick={() =>
                    handleAddToCart(
                      product.productId,
                      product.productPrice,
                      product.productName,
                      product.productPhoto.filename
                    )
                  }
                  style={{ display: accountType === "user" ? "block" : "none" }}
                >
                  Add to Cart
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteButton(product.productId)}
                  style={{
                    display: accountType === "seller" ? "flex" : "none",
                  }}
                >
                  Delete
                </button>
                <Button
                  className="btn btn-warning mt-1"
                  onClick={() => handleUpdateButton(product.productId)}
                  style={{
                    display: accountType === "seller" ? "flex" : "none",
                  }}
                >
                  Edit
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default ProductList;
