const db = require("../../../../server/mongoose");
const mongoose = require("mongoose");
const { get_all } = require("../../controllers/resource");


describe("Test: Resource controllers", () => {
  test("get_all - retrieve all resources from mongodb", async () => {
    const req = { params: { id: "" } };
    const res = {};
    const next = (err) => console.log(err);
    await get_all(req, res, next);
    expect(res.status).toBe(200);
  });
  afterAll(async () => {
    mongoose.connection.close();
  });
});
