const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const { mongoose_connect } = require("./mongodb/connect");

const app = express();
mongoose_connect();
app.use(cors());

app.use(express.json());

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Product routes
app.use("/product", productRoutes);

// Mount the product routes under '/api'

const PORT = process.env.PORT || 3029;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
