const mongoose = require("mongoose");

const ItemSchema = mongoose.Schema({
  name: String,
  categoryId: String, //Displayed as "type"
  price: Number,
  photo: String,
});

module.exports = mongoose.model("Item", ItemSchema);
