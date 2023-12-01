const express = require("express");
const router = express.Router();
const multer = require("multer");
const Product = require("../mongodb/AgentProduct");
const admin = require("../firebase/service"); // Update the path accordingly
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Define the Firebase Storage bucket
const bucket = admin.storage().bucket();
router.post("/upload", upload.single("photo"), (req, res) => {
  try {
    if (!req.file) {
      console.log("hwjk");
      return res.status(400).send("No file uploaded.");
    }

    // Extract file information
    const file = req.file;
    const fileName = file.originalname;
    const fileBuffer = file.buffer;

    // Define the file destination in Firebase Storage
    const fileDestination = `photos/${fileName}`;

    // Upload the file to Firebase Storage
    const fileUpload = bucket.file(fileDestination);
    const stream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype,
      },
    });

    let uploadedBytes = 0;
    const totalBytes = fileBuffer.length;

    stream.on("error", (error) => {
      console.error(error);
      return res.status(500).send("Error uploading file to Firebase Storage.");
    });

    stream.on("progress", (snapshot) => {
      // Calculate the progress percentage
      uploadedBytes = snapshot.bytesWritten;
      const progress = (uploadedBytes / totalBytes) * 100;
      console.log(`Upload progress: ${progress.toFixed(2)}%`);
      // You can emit or send the progress to the client here
    });

    stream.on("finish", async () => {
      const signedUrl = await fileUpload.getSignedUrl({
        action: "read",
        expires: "03-09-2025", // Adjust the expiration date as needed
      });

      return res.status(200).json({ imageUrl: signedUrl[0] });
    });

    stream.end(fileBuffer);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Internal Server Error.");
  }
});

// Create a new product
router.post("/products", async (req, res) => {
  try {
    // Extract product data from the request body
    const {
      productName,
      price,
      discount,
      houseId,
      category,
      status,
      imageUrl,
      discountPercentage,
      Description,
      unit,
      basevariant,
      agentid,

      variants,
    } = req.body;

    // Create a new product instance using the Product model
    const newProduct = new Product({
      productName,
      price,
      discount,
      houseId,
      category,
      status,
      imageUrl,
      discountPercentage,
      Description,
      unit,
      basevariant,
      agentid,

      variants,
    });

    // Save the product to the database
    await newProduct.save();

    // Respond with the newly created product
    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/products/:agentid", async (req, res) => {
  console.log(req);
  try {
    const { agentid } = req.params;
    const { page = 1, limit = 10 } = req.query;

    // Query the database with pagination
    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      select: { description_embedding: 0, name_embedding: 0 },
    };

    const products = await Product.paginate({ agentid }, options);

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.put("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Extract updated product data from the request body
    const {
      productName,
      price,
      discount,

      category,
      status,
      imageUrl,
      discountPercentage,
      Description,
      unit,
      basevariant,
      agentid,
      variants,
    } = req.body;
    console.log(req.body);

    // Find the product by ID
    const existingProduct = await Product.findById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Update the product fields
    existingProduct.productName = productName;
    existingProduct.price = price;
    existingProduct.discount = discount;

    existingProduct.category = category;
    existingProduct.status = status;
    existingProduct.imageUrl = imageUrl;
    existingProduct.discountPercentage = discountPercentage;
    existingProduct.Description = Description;
    existingProduct.unit = unit;
    existingProduct.basevariant = basevariant;
    existingProduct.agentid = agentid;
    existingProduct.variants = variants;

    // Save the updated product to the database
    await existingProduct.save();

    // Respond with the updated product
    res.status(200);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.get("/product/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    // Find the product by ID
    const product = await Product.findById(productId).select(
      "-description_embedding -name_embedding"
    );

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    // Respond with the product details
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
