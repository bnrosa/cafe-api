const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;

//Types
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

//Models
const Item = require("../models/Item");
const Category = require("../models/Category");

//Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Item.findById(args.id);
      },
    },
    category: {
      type: CategoryType,
      args: { id: { type: GraphQLID } },
      resolve(parent, args) {
        return Category.findById(args.id);
      },
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve() {
        return Item.find({});
      },
    },
    categories: {
      type: new GraphQLList(CategoryType),
      resolve() {
        return Category.find({});
      },
    },
  },
});

//Mutations
const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addCategory: {
      type: CategoryType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve(parent, args) {
        let category = new Category({
          name: args.name,
        });
        return category.save();
      },
    },
    addItem: {
      type: ItemType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        photo: { type: new GraphQLNonNull(GraphQLString) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        categoryId: { type: new GraphQLNonNull(GraphQLID) },
      },
      resolve(parent, args) {
        let item = new Item({
          name: args.name,
          genre: args.genre,
          authorId: args.authorId,
        });
        return item.save();
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
