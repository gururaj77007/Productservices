const mongoose = require("mongoose");
var conn = mongoose.createConnection(
  "mongodb+srv://vvce21cseaiml0004:Ramguru123@gb.dq3vt5r.mongodb.net/Service?retryWrites=true&w=majority"
);
const mongoosePaginate = require("mongoose-paginate-v2");

const requestServiceSchema = new mongoose.Schema({
  Houseid: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  service: {
    type: String,
    required: true,
  },
  requestDate: {
    type: String,
    required: true,
  },
  requestTime: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "pending",
  },
  created: {
    type: Date,
    default: Date.now,
  },
});
requestServiceSchema.plugin(mongoosePaginate);

// RequestService Model
const RequestService = conn.model("RequestService", requestServiceSchema);

// Create a separate connection

const timeSlotSchema = new mongoose.Schema({
  time: {
    type: String,
    required: true,
  },
  vacancy: {
    type: Number,
    required: true,
  },
});

const serviceSlotSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
  },
  time: {
    type: [timeSlotSchema],
    required: true,
  },
});

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  Houseid: {
    type: String,
  },
  serviceSlots: {
    type: [serviceSlotSchema],
    required: true,
  },
});

serviceSchema.plugin(mongoosePaginate);

// Create a model for the "Service" schema using the connection
const Service = conn.model("Service", serviceSchema);

module.exports = { Service, RequestService };
