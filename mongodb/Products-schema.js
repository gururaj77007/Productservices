const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

// Create a separate connection
var conn = mongoose.createConnection(
  "mongodb+srv://vvce21cseaiml0004:Ramguru123@gb.dq3vt5r.mongodb.net/Product?retryWrites=true&w=majority"
);

const reviewSchema = new mongoose.Schema({
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const variantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  price: {
    type: Number,
  },
  discount: {
    type: Number,
  },
});

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    default: 0,
  },
  houseId: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active",
  },
  imageUrl: {
    type: [String],
  },
  discountPercentage: {
    type: Number,
  },
  Description: {
    type: String,
  },
  reviews: [reviewSchema],
  unit: {
    type: String,
  },
  variants: [variantSchema],
  basevariant: {
    type: String,
    required: true,
  },
});

// Apply the pagination plugin to your schema
productSchema.plugin(mongoosePaginate);

// Create a model for the "Product" schema using the connection
const Product = conn.model("Product", productSchema);

module.exports = Product;
