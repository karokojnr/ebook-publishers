const mongoose = require("mongoose");

const PublisherSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  isPublisher: {
    type: String,
    default: "YES",
  },
  date: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Publisher", PublisherSchema);
