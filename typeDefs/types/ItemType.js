const graphql = require("graphql");

const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLInt,
} = require("graphql");

//Import models
const Category = require("../models/Category");

//Defining type
const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
    photo: { type: GraphQLString },
    category: {
      type: CategoryType,
      resolve(parent, args) {
        return Category.findById(parent.authorId);
      },
    },
  }),
});

module.exports = ItemType;
