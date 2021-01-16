const mongoose = require("mongoose");
require("dotenv").config();

const db = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  pass: process.env.DB_PASS,
  name: process.env.DB_NAME,
};

const dbUri = `mongodb+srv://${db.user}:${db.pass}@${db.host}/${db.name}?retryWrites=true&w=majority`;
const dbOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(dbUri, dbOptions)
  .then(() => console.log("Database connected"))
  .catch((error) => console.log("Databased failed: ", error));
