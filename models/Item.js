const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  name: String,
  itemTypeId: String,
  price: Number,
  photo: String,
});

module.exports = mongoose.model("Item", ItemSchema);
