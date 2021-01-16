const mongoose = require("mongoose");

//On code, the type is going to be named Category so it's
//not confused with GraphQL's Type.
//It will still be displayed as "type" to the end user
const CategorySchema = mongoose.Schema({
  name: String,
});

module.exports = mongoose.model("Category", CategorySchema);
