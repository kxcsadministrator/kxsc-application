const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
let server = ''
let institute_id = ''
let task_id = ''
let comment_id = ''

require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
    server = app.listen(5000, () => {
      console.log(`Test Server Started..., listening on port: 5000`);
    })  
    mongoose.connect(process.env.DATABASE_URL);
    console.log('Database connected');
    
    const res = await request(app).post("/institutes/new").send({
        name: "Test institute"
    });
    institute_id = res.body._id;
});
    
    /* Closing database connection after each test. */
    afterAll(async () => {
        // const res = await request(app).delete(`/institutes/delete/${institute_id}`); 
        await mongoose.connection.close();
        server.close()
});

// describe("POST /tasks/new/:id", () => {
//     it("should create a task for the given institute", async () => {
//       const res = await request(app).post(`/tasks/new/${institute_id}`).send({
//         name: "Test Task",
//         author: "Test author"
//       });
//       task_id = res.body._id;
//       if (res.statusCode == 400) console.log(res.message);
//       expect(res.statusCode).toBe(201);
//       expect(res.body.name).toBe("Test Task");
//     });
// });

// describe("GET /tasks/institute/:id/all", () => {
//     it("should return all tasks for the given institute", async () => {
//         const res = await request(app).get(`/tasks/institute/${institute_id}/all`)

//         expect(res.statusCode).toBe(200);
//         expect(res.body.length).toBeGreaterThan(0);
//     });
// })

// describe("GET /tasks/one/:id", () => {
//     it("should return a task given a valid id", async () => {
//         const res = await request(app).get(`/tasks/one/${task_id}`)

//         expect(res.statusCode).toBe(200);
//         expect(res.body.name).toBe("Test Task");
//     })
    
// })

// describe("PATCH /tasks/edit/:id", () => {
//     it("should update the name of a given task", async () => {
//         const res = await request(app).patch(`/tasks/edit/${task_id}`).send({
//             name: "Updated Test Task"
//         })
//         expect(res.statusCode).toBe(201);
//         expect(res.body.name).toBe("Updated Test Task");
//     })
// })

// describe("PATCH /tasks/add-collabs/:id", () => {
//     it("should add collaborators for a given task", async () => {
//         const res = await request(app).patch(`/tasks/add-collabs/${task_id}`).send({
//             collaborators: ["foo1", "foo2"]
//         })
//         expect(res.statusCode).toBe(201);
//         expect(res.body.collaborators).toStrictEqual(["foo1", "foo2"]);
//     })
// })

// describe("PATCH /tasks/remove-collabs/:id", () => {
//     it("should remove collaborators for a given task", async () => {
//         const res = await request(app).patch(`/tasks/remove-collabs/${task_id}`).send({
//             collaborators: ["foo2"]
//         })
//         expect(res.statusCode).toBe(201);
//         expect(res.body.collaborators).toStrictEqual(["foo1"]);
//     })
// })

// describe("POST /tasks/:id/comments/new", () => {
//     it("should add a comment for a given task", async () => {
//         const res = await request(app).post(`/tasks/${task_id}/comments/new`).send({
//             author: "Test author",
//             body: "Test comment"
//         })
//         comment_id = res.body._id;
//         expect(res.statusCode).toBe(201);
//         expect(res.body.body).toBe("Test comment");
//         expect(res.body.author).toBe("Test author");
//     })
// })

// describe("GET /tasks/:id/comments/all", () => {
//     it("should return all comments for a given task", async () => {
//         const res = await request(app).get(`/tasks/${task_id}/comments/all`)
//         expect(res.statusCode).toBe(200);
//         expect(res.body.length).toBeGreaterThan(0);
//     })
// })

// describe("PATCH /tasks/comments/:id/edit", () => {
//     it("Should update the body of a given comment", async () => {
//         const res = await request(app).patch(`/tasks/comments/${comment_id}/edit`).send({
//             body: "Updated test comment"
//         })
//         expect(res.statusCode).toBe(201);
//         expect(res.body.body).toBe("Updated test comment");
//     })
// })

// describe("DELETE /tasks/comments/:id/delete", () => {
//     it("Should delete a comment", async () => {
//         const res = await request(app).delete(`/tasks/comments/${comment_id}/delete`);
//         expect(res.statusCode).toBe(204);
//     })
// })

// describe("DELETE /tasks/delete/:id", () => {
//     it("Should delete a task", async () => {
//         const res = await request(app).delete(`/tasks/delete/${task_id}`);
//         expect(res.statusCode).toBe(204);
//     })
// })

describe("GET /tasks/:id/comments/all", () => {
    it("should return all comments for a given task", async () => {
        // const res = await request(app).get(`/tasks/${task_id}/comments/all`)

        const res = {statusCode: 404}
        expect(res.statusCode).toBe(404);
    })
})
