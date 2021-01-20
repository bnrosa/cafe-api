//Import dependencies
const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { graphqlUploadExpress } = require("graphql-upload");
const { graphqlHTTP } = require("express-graphql");
const { GraphQLUpload } = require("graphql-upload");

//Initialize db
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

//Build schema
const schema = require("./schema");

//Initialize server
const app = express();
app.use(cors());

app.use(
  "/graphql",
  graphqlUploadExpress({
    maxFileSize: 10000000,
    maxFiles: 10,
    uploadDir: "./images",
  }),
  graphqlHTTP({
    schema,
    graphiql: process.env.IS_LOCALHOST ? true : false,
  })
);

app.use("/images", express.static("images"));

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`now listening for requests on port ${port}`);
});
