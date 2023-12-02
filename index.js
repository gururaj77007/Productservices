const cluster = require("cluster");
const os = require("os");
const express = require("express");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const cors = require("cors");
const service = require("./routes/services");
const agentroutes = require("./routes/Agentproduct");
const responseTime = require("response-time");

const app = express();

// Use CORS middleware
app.use(cors());

app.use(express.json());
app.use(
  responseTime((req, res, time) => {
    console.log(req.method, req.url, time + "ms");
  })
);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// Product routes
app.use("/product", productRoutes);
app.use("/services", service);
app.use("/agent", agentroutes);

const PORT = process.env.PORT || 3029;

if (cluster.isMaster) {
  // Fork workers based on the number of CPU cores
  const numCPUs = os.cpus().length;
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} died`);
    // You may want to respawn the worker here
  });
} else {
  // Worker process
  app.listen(PORT, () => {
    console.log(
      `Server is running on port ${PORT} (Worker ${cluster.worker.id})`
    );
  });
}
