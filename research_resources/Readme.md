# Knowledge Exchange System

## Resource Microservice
The project has been structured as follows:
### db:
Uses mongodb as the database. Mongoose as the driver.
- models.js: stores the schema for the resources and categories database
- repository.js: contains code that directly interacts with the databse

### routes:
Handles the request/response logic for the application. Calls functions implemented in repository.js to interact with db
- categories.js: contains routes for managing categories and interacting with categories collection.
- resources.js: contains routes for managing resources and interacting with resources collection.