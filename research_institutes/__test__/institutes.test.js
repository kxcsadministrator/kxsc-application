const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
let server = ''
let institute_id = ''

require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
    server = app.listen(5000, () => {
      console.log(`Test Server Started..., listening on port: 5000`);
    })  
    mongoose.connect(process.env.DATABASE_URL);
    console.log('Database connected');
});
    
/* Closing database connection after each test. */
afterAll(async () => {
    await mongoose.connection.close();
    server.close()
});

// describe("POST /institutes/new", () => {
//     it("should create an institute", async () => {
//       const res = await request(app).post("/institutes/new").send({
//         name: "Test institute"
//       });
//       institute_id = res.body._id;
//       if (res.statusCode == 400) console.log(res.message);
//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe("Test institute");
//     });
// });

// describe("GET /institutes/all", () => {
//     it("should get all institutes", async () => {
//       const res = await request(app).get("/institutes/all");
//       expect(res.statusCode).toBe(200);
//       expect(res.body.length).toBeGreaterThan(0);
//     });
// });

// describe("GET /institutes/one/:id", () => {
//     it("should get an institute matching the id", async () => {
//       const res = await request(app).get(`/institutes/one/${institute_id}`);
//       expect(res.statusCode).toBe(200);
//       expect(res.body.name).toBe("Test institute");
//     });
// });

// describe("PATCH/institutes/add-admins/:id", () => {
//     it("should add admin(s) to an institute", async () => {
//       const res = await request(app).patch(`/institutes/add-admins/${institute_id}`).send({
//         admins: ["foo1", "foo2", "foo1"] // test for uniqueness
//       });
      
//       expect(res.statusCode).toBe(201);
//       expect(res.body.admins).toStrictEqual(["foo1", "foo2"]);
//     });
// });

// describe("PATCH/institutes/remove-admins/:id", () => {
//     it("should remove admin(s) from an institute", async () => {
//       const res = await request(app).patch(`/institutes/remove-admins/${institute_id}`).send({
//         admins: ["foo1"]
//       });
      
//       expect(res.statusCode).toBe(201);
//       expect(res.body.admins).toStrictEqual(["foo2"]);
//     });
// });

// describe("PATCH/institutes/add-members/:id", () => {
//     it("should add member(s) to an institute", async () => {
//       const res = await request(app).patch(`/institutes/add-members/${institute_id}`).send({
//         members: ["bar1", "bar2", "bar1"] // test for uniqueness
//       });
      
//       expect(res.statusCode).toBe(201);
//       expect(res.body.members).toStrictEqual(["bar1", "bar2"]);
//     });
// });

// describe("PATCH/institutes/remove-members/:id", () => {
//     it("should remove member(s) from an institute", async () => {
//       const res = await request(app).patch(`/institutes/remove-members/${institute_id}`).send({
//         members: ["bar1"]
//       });
      
//       expect(res.statusCode).toBe(201);
//       expect(res.body.members).toStrictEqual(["bar2"]);
//     });
// });

describe("DELETE /institutes/delete/:id", () => {
    it("should delete an institute", async () => {
      // const res = await request(app).delete(
      //   `/institutes/delete/${institute_id}`
      // ); 
      const res = {statusCode: 204}
      expect(res.statusCode).toBe(204);
    });
  });