const mongoose = require("mongoose");
require("dotenv").config();

let mongoose_connect = async () => {
  mongoose.set("strictQuery", true);
  await mongoose
    .connect(`${process.env.MONGODB_URI}`, { useNewUrlParser: true })
    .then((e) => {
      console.log("mongodbconnected");
    });
};

//exports
module.exports = { mongoose_connect };
