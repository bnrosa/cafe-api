const server = require("../server");
const supertest = require("supertest");
const request = supertest(server.app);
const Item = require("../models/Item");

afterAll(async () => {
  await Item.findOneAndDelete({}, { sort: { _id: -1 } });
  await server.database.disconnect();
  await server.express.close();
});

/**
 * @jest-environment node
 */
test("addMenuItem", async (done) => {
  const fixturePath = __dirname + "/sushi.jpeg";
  const query = `
    mutation($file: Upload!, $name: String!, $price: Int!, $type: String!) {
        addMenuItem(file: $file, name: $name, price: $price, type: $type) {
            id
            name
            type
            photo
        }
    }`;

  request
    .post("/graphql")
    .set("Content-Type", "multipart/form-data")
    .field(
      "operations",
      JSON.stringify({
        query,
        variables: {
          file: null,
          name: "Sushi123",
          price: 10,
          type: "Sushi",
        },
      })
    )
    .field(
      "map",
      JSON.stringify({
        file: ["variables.file"],
      })
    )
    .attach("file", fixturePath)
    .expect(({ body }) => {
      expect(body.data.addMenuItem).toBeDefined();
    })
    .expect(200)
    .end(function (err, res) {
      if (err) return done(err);
      expect(res.body.data.addMenuItem.id).toBeDefined();
      expect(res.body.data.addMenuItem.photo).toBeDefined();
      expect(res.body.data.addMenuItem.name).toBe("Sushi123");
      expect(res.body.data.addMenuItem.type).toBe("Sushi");
      done();
    });
}, 10000);
