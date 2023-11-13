const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const { mongoose_connect } = require("./mongodb/connect");

const app = express();
mongoose_connect();
app.use(cors());

app.use(express.json());
app.use("/product", productRoutes, () => {
  console.log("lknk");
});
// Mount the product routes under '/api'

const PORT = process.env.PORT || 3029;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
