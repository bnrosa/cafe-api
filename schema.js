const graphql = require("graphql");
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLID,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLNonNull,
  GraphQLSchema,
} = graphql;
const { GraphQLUpload } = require("graphql-upload");
const { createWriteStream, mkdir } = require("fs");
const shortid = require("shortid");
//Types

const ItemType = new GraphQLObjectType({
  name: "Item",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    price: { type: GraphQLInt },
    photo: { type: GraphQLString },
    type: { type: GraphQLString },
  }),
});

//Models
const Item = require("./models/Item");

//Query
const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    item: {
      type: ItemType,
      args: { id: { type: new GraphQLNonNull(GraphQLString) } },
      resolve(parent, args) {
        return Item.findById(args.id);
      },
    },
    items: {
      type: new GraphQLList(ItemType),
      resolve() {
        return Item.find({});
      },
    },
  },
});

//Mutations
const processUpload = async (upload) => {
  const { createReadStream, filename, mimetype } = await upload;
  const stream = createReadStream();
  const file = await storeUpload({ stream, filename, mimetype });
  return file;
};
const storeUpload = async ({ stream, filename, mimetype }) => {
  const id = shortid.generate();
  const path = `images/${id}-${filename}`;

  return new Promise((resolve, reject) =>
    stream
      .pipe(createWriteStream(path))
      .on("finish", () => resolve({ id, path, filename, mimetype }))
      .on("error", reject)
  );
};

const Mutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    addMenuItem: {
      type: ItemType,
      args: {
        name: { type: new GraphQLNonNull(GraphQLString) },
        file: { type: new GraphQLNonNull(GraphQLUpload) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        type: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { file, name, price, type }) => {
        mkdir("images", { recursive: true }, (err) => {
          if (err) throw err;
        });

        const upload = await processUpload(file);
        const item = new Item({
          name: name,
          price: price,
          type: type,
          photo: upload.path,
        });
        await item.save();
        return item;
      },
    },
    updateMenuItem: {
      type: ItemType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        file: { type: new GraphQLNonNull(GraphQLUpload) },
        price: { type: new GraphQLNonNull(GraphQLInt) },
        type: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { file, name, price, type, id }) => {
        mkdir("images", { recursive: true }, (err) => {
          if (err) throw err;
        });

        const upload = await processUpload(file);
        const item = await Item.findByIdAndUpdate(id, {
          name: name,
          price: price,
          type: type,
          photo: upload.path,
        });
        item.save();
        return item;
      },
    },
    deleteMenuItem: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: (_, { id }) => {
        const deletedItem = Item.findByIdAndRemove(id).exec();
        if (deletedItem) return true;
        else return false;
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});
