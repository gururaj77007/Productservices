const express = require("express");
const router = express.Router();
// Import the response-time middleware
const Product = require("../mongodb/Products-schema");

// Use the response-time middleware to measure response time

router.get("/:productId", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product by its ID
    const product = await Product.findById(productId);
    console.log(product);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Log the response time to the console

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  console.log(req.body);
  console.log("here");
  try {
    const {
      category,
      minimal,
      page,
      pageSize,
      minDiscountPercentage,
      maxDiscountPercentage,
    } = req.body;

    // Define the query object with the "status" filter
    const query = {
      status: "Active",
    };

    // Add category filter if provided
    if (category) {
      console.log(category);
      query.category = category;
    }
    console.log(minDiscountPercentage);
    // Add discount percentage filter if provided
    if (
      minDiscountPercentage !== undefined &&
      maxDiscountPercentage !== undefined
    ) {
      query.discountPercentage = {
        $gte: parseFloat(minDiscountPercentage),
        $lte: parseFloat(maxDiscountPercentage),
      };
    }

    // Define the projection based on the "minimal" parameter
    let projection =
      minimal === "true"
        ? { _id: 1, productName: 1, price: 1, imageUrl: 1 }
        : {};

    // Define pagination options using page and pageSize
    const options = {
      skip: (page - 1) * pageSize || 10,

      page: parseInt(page) || 1,
      limit: parseInt(pageSize) || 10,
    };

    // Find products matching the query with pagination
    const products = await Product.paginate(query, options);
    console.log(products);

    // Log the response time to the console

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});
// Import necessary modules and models

// Add a review for a product
// Import necessary modules and models

// Add a review for a product
router.post("/:productId/reviews", async (req, res) => {
  try {
    const productId = req.params.productId;
    const { rating, text, userId } = req.body;
    console.log(rating, text, userId);

    // Check if the user has already reviewed this product
    const product = await Product.findOne({
      _id: productId,
      "reviews.userId": userId,
    });

    if (product) {
      return res
        .status(400)
        .json({ message: "You've already reviewed this product." });
    }

    // Create a new review
    const review = { rating, text, userId };

    // Find the product by its ID and push the review into the reviews array
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      { $push: { reviews: review } },
      { new: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(updatedProduct.reviews); // You can return the updated reviews or a success message
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get reviews for a product
router.get("/:productId/reviews", async (req, res) => {
  try {
    const productId = req.params.productId;

    // Find the product by its ID and return the reviews
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product.reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
