const graphql = require("graphql");

const {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLList,
} = require("graphql");

//Import models
const Item = require("../models/Item");

const CategoryType = new GraphQLObjectType({
  name: "Category",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    items: {
      type: new GraphQLList(ItemType),
      resolve(parent, args) {
        return Item.find({ categoryId: parent.id });
      },
    },
  }),
});

module.exports = CategoryType;
