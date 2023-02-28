require('dotenv').config();
const app = require('./server')
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
const port = process.env.SERVER_PORT || 3000

mongoose.connect(mongoString);
const database = mongoose.connection;

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

app.listen(port, () => {
    console.log(`Server Started..., listening on port: ${port}`);
})

module.exports = app;