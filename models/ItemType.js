const mongoose = require("mongoose");

const ItemTypeSchema = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("ItemType", ItemTypeSchema);
