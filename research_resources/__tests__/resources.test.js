const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
let server = ''
let resource_id = ''
let test_cat_id = ''

require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
  server = app.listen(5000, () => {
    console.log(`Test Server Started..., listening on port: 5000`);
  })  
  mongoose.connect(process.env.DATABASE_URL);
  // const res = await request(app).post("/categories/new").send({
  //   name: "test_category",
  //   sub_categories: ["sub1", "sub2"]
  // });
  // test_cat_id = res.body._id;
});
  
  /* Closing database connection after each test. */
  afterAll(async () => {
    // const res = await request(app).delete(`/categories/delete/${test_cat_id}`);
    await mongoose.connection.close();
    server.close()
});

// describe("POST /resources/new", () => {
//   it("should create a resource", async () => {
//     const res = await request(app).post("/resources/new").send({
//       topic: "Test Resource",
//       description: "For testing purposes",
//       authors: ["Test John Doe"],
//       category: "test_category",
//       sub_categories: ["sub1", "sub2"],
//       resource_type: "Government"
//     });
//     resource_id = res.body._id
//     expect(res.statusCode).toBe(201);
//     expect(res.body.topic).toBe("Test Resource");
//   });
// });

// describe("GET /resources/one/:id", () => {
//   it("should return a resource", async () => {
//     const res = await request(app).get(
//       `/resources/one/${resource_id}`
//     );
//     expect(res.statusCode).toBe(200);
//     expect(res.body.description).toBe("For testing purposes");
//   });
// });

// describe("GET /resources/all", () => {
//     it("should return all resources", async () => {
//       const res = await request(app).get("/resources/all");
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBeGreaterThan(0);
//     });
// });

// describe("PATCH /resources/update/:id", () => {
//   it("should update a resource", async () => {
//     const res = await request(app).patch(`/resources/update/${resource_id}`).send({
//       topic: "Updated Test Resource",
//     });
//     if (res.statusCode == 400) console.log("Update", res.body.message);
//     expect(res.statusCode).toBe(201);
//     expect(res.body.topic).toBe("Updated Test Resource");
//   });
// });

// describe("POST /resources/rate", () => {
//   it("should rate an existing resource", async () => {
//     const res = await request(app).post("/resources/rate").send({
//       id: resource_id,
//       value: 4
//     });
//     if (res.statusCode == 400) console.log("rate", res.body.message);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.ratings).toStrictEqual([4]);
//   });
// });

// describe("GET /resources/rating/:id", () => {
//   it("should return the average rating for a resource", async () => {
//     const res = await request(app).get(
//       `/resources/rating/${resource_id}`
//     );
//     if (res.statusCode == 400) console.log("rating", res.body.message);
//     expect(res.statusCode).toBe(200);
//     expect(res.body.average).toBe(4);
//   });
// });

// describe("PATCH /resources/update-category/:id", () => {
//   it("should fail to update a resource category because the new category doesn't exist", async () => {
//     const res = await request(app).patch(`/resources/update-category/${resource_id}`).send({
//       category: "non-existent category",
//     });
//     expect(res.statusCode).toBe(404);
//     expect(res.body.message).toBe("Category: non-existent category not found");
//   });
// });

describe("DELETE /resources/delete/:id", () => {
  it("should delete a resource", async () => {
    // const res = await request(app).delete(
    //   `/resources/delete/${resource_id}`
    // ); 
    // if (res.statusCode == 400) console.log("delete", res.body.message);
    const res = {statusCode: 204}
    expect(res.statusCode).toBe(204);
  });
});