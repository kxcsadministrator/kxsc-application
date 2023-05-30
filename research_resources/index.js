require('dotenv').config();
const https = require('https')
const fs = require('fs')
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

https.createServer(
    // Provide the private and public key to the server by reading each
    // file's content with the readFileSync() method.
    {
    key: fs.readFileSync("privkey.pem"),
    cert: fs.readFileSync("fullchain.pem"),
    },
    app
    )
    .listen(port, () => {
    console.log(`Server Started..., listening on port: ${port}`);
});

// app.listen(port, () => {
//     console.log(`Server Started..., listening on port: ${port}`);
// })

// module.exports = app;