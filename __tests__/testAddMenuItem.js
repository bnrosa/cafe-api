const app = require("../server");
const supertest = require("supertest");

const request = supertest(app);

test("addMenuItem", async (done) => {
  const fixturePath = "./sushi.jpeg";

  const query = `
    mutation($file: Upload!, $name: String!, $price: Int!, $type: String!) {
        addMenuItem(file: $file, name: $name, price: $price, type: $type) {
            id
            name
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
    .expect(200);
  done();
});
