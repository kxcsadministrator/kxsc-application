const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const user_router = require('./routes/users');
const message_router = require('./routes/messages');


const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
      title: 'Express API for Resource Exchange System - Users Microservice',
      version: '1.0.0',
      description:
        'This is a REST API application made with Express. It Handles everything concerning managing Users authentication and authorization',
      license: {
        name: `
        Copyright (C) Knowledge Exchange System - All Rights Reserved
        Unauthorized copying of this file, via any medium is strictly prohibited
        Proprietary and confidential
        Written by Eze Isaac <ezeud084@gmail.com> and Timothy Akoji <timothyakoji@gmail.com>, Febuary 2023`,
      },
      contact: {
        name: 'Eze Isaac',
        url: 'ezeud084@gmail.com',
      },
    },
    servers: [
      {
        url: 'http://<base_url>:3001',
        description: 'Development server',
      },
    ],
  };

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

const app = express();

app.use(express.json());

// enable CORS
app.use(cors());

// add other middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));

app.use(express.static('uploads'));

//routes
app.use('/users', user_router);
app.use('/messages', message_router);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app