const mongoose = require("mongoose");

const OpinionSchema = new mongoose.Schema({
  score: {
    type: String,
    requierd: true,
  },
  title: {
    type: String,
    requierd: true,
    trim: true,
  },
  story: {
    type: String,
    requierd: true,
  },
});

module.exports = mongoose.model("opinion", OpinionSchema);
