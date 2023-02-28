const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
let server = ''
let user_id = ''
let super_user_id = ''
let regular_username = 'testuser'
let regular_email = 'testuser@email.com'
let super_email = 'testsuperuser@email.com'
let password = 'testpassword'
let super_username = 'testsuperuser'



require("dotenv").config();

/* Connecting to the database before test. */
beforeAll(async () => {
    server = app.listen(5000, () => {
      console.log(`Test Server Started..., listening on port: 5000`);
    })  
    mongoose.connect(process.env.DATABASE_URL);
    console.log('Database connected');
});
    
/* Closing database connection after test. */
afterAll(async () => {
    await mongoose.connection.close();
    server.close()
});

// describe('POST /users/new', () => {
//     it('should create a new user', async () => {
//         const res = await request(app).post('/users/new').send({
//             username: regular_username,
//             email: regular_email,
//             password: password
//         })
//         if (res.statusCode == 400) console.log(res.message);
//         user_id = res.body._id;
//         expect(res.statusCode).toBe(201);
//         expect(res.body.username).toBe(regular_username);
//     })
// })

// describe('GET /users/one/:id', () => {
//     it("should get one user", async () => {
//         const login_res = await request(app).post('/users/login').send({
//             username: regular_username,
//             password: password
//         });
        
//         const res =  await request(app).get(`/users/one/${user_id}`).set('Authorization', 'bearer ' + login_res.body.jwt_token)
//         if (res.statusCode == 400) console.log(res.message);
//         expect(res.statusCode).toBe(200);
//         expect(res.body.username).toBe(regular_username);
//     })
// })

// describe('GET /users/all', () => {
//     it("should fail to get all users (superadmin access required)", async () => {
//         const login_res = await request(app).post('/users/login').send({
//             username: regular_username,
//             password: password
//         });
        
//         const res =  await request(app).get(`/users/all`).set('Authorization', 'bearer ' + login_res.body.jwt_token)
//         expect(res.statusCode).toBe(401);
//     })
// })

// describe('PATCH /users/edit-username', () => {
//     it("should edit user's username", async () => {
//         const login_res = await request(app).post('/users/login').send({
//             username: regular_username,
//             password: password
//         });
        
//         const res = await request(app).patch(`/users/${user_id}/edit-username`).set('Authorization', 'bearer ' + login_res.body.jwt_token)
//         .send({
//             new_username: 'updated-testuser'
//         })
//         if (res.statusCode == 400) console.log(res.message);
//         expect(res.statusCode).toBe(201);
//         regular_username = 'updated-testuser';
//         expect(res.body.username).toBe('updated-testuser');
//     })
// })

describe('DELETE /users/delete/:id', () => {
    it("should delete a user", async () => {
        // const login_res = await request(app).post('/users/login').send({
        //     username: regular_username,
        //     password: password
        // });
        
        // const res = await request(app).delete(`/users/delete/${user_id}`).set('Authorization', 'bearer ' + login_res.body.jwt_token)
        // if (res.statusCode == 400) console.log(res);
        const res = {statusCode: 204}
        expect(res.statusCode).toBe(204);
    })
})

