require('dotenv').config();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const prompt = require('prompt-sync')({sigint: true});

const Model = require('./db/models');
const repository = require('./db/repository');

mongoose.connect(mongoString)
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error);
    readline.close();
})

database.once('connected', async() => {
    console.log('Database Connected');

    console.log("Creating a superuser... Use CTRL + C to exit");
  
    let email = prompt('email: ');
    let user = await repository.get_user_by_email(email);
    while (user){
        email = prompt('user with this email already exists, please use another one: ');
        user = await repository.get_user_by_email(email);
    }
    let username = prompt('username: ');

    user = await repository.get_user_by_username(username);
    while (user){
        username = prompt('user with this username already exists, please use another one: ');
        user = await repository.get_user_by_username(username);
    }

    let password = prompt('password (at least 5 characters): ');
    while (password.length < 5){
        password = prompt('password (at least 5 characters): ');
    }

    const data = new Model.user({
        username: username,
        email: email,
        password: password,
        superadmin: true
    })
    const result = await repository.create_new_user(data);
    console.log('Superuser created successfully: ')
    console.log(result);
    database.close();
    process.exit();
})

