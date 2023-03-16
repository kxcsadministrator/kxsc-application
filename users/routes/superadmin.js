const express = require('express');
const multer = require("multer");
const validator = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Model = require('../db/models');
const repository = require('../db/repository');
const schemas = require('../schemas/users-schema');
const helpers = require('../helpers');
const router = express.Router()

const SALT_ROUNDS = 10
const SECRET_KEY = process.env.SECRET_KEY || 'this-is-just for tests'


/** 
 * @swagger
 * /users/new/super-admin:
 *  post:
 *      summary: Converts a regular user to a superadmin
 *      description: |
 *          Ideally, the system should have only one superadmin. But this was added for scenarios where additional superadmins
 *          need to be created.
 *          
 *          Only a superadmin has the permission to create a superadmin.
 * 
 *          A username, email and password must be provided
 * 
 *          ## Schema
 *          ### username: {required: true, type: String}
 *          ### email: {required: false, type: String}
 *          ### password: {required: true, type: String} 
 * responses:
 *    '201':
 *      description: Created
 *    '409':
 *      description: User already exists
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/  
router.post('/new/super-admin', validator.checkSchema(schemas.newUserSchema), async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST users/new/super-admin - 401: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST users/new/super-admin - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`POST users/new/super-admin - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const user = await repository.get_user_by_id(decodedToken.user_id);
        if (!user.superadmin) {
            helpers.log_request_error(`POST users/new/super-admin - 401: Unauthorized access. Only a superadmin can create superadmins`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can create superadmins'});
        }

        const dup_name = await repository.get_user_by_username(req.body.username);
        if (dup_name) {
            helpers.log_request_error(`POST users/new/super-admin - 409: user with username ${req.body.username} already exists`)
            return res.status(409).json({message: `user with username ${req.body.username} already exists`});
        }

        const dup_mail = await repository.get_user_by_email(req.body.email);
        if (dup_mail) {
            helpers.log_request_error(`POST users/new/super-admin - 409: user with email ${req.body.email} already exists`)
            return res.status(409).json({message: `user with email ${req.body.email} already exists`});
        }

        const data = new Model.user({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
            superadmin: true
        })
        const result = await repository.create_new_user(data);

        helpers.log_request_info(`POST users/new/super-admin - 200`)
        res.status(201).json(result);

    } catch (error) {
        helpers.log_request_error(`POST users/new/super-admin - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/make-super-admin/{id}:
 *  patch:
 *      summary: Converts a regular user to a super admin
 *      description: |
 *          Ideally, the system should have only one superadmin. But this was added for scenarios where additional superadmins
 *          need to be created.
 *          
 *          Only a superadmin has the permission to modify the admin status of another user.
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/ObjectID
 *            required: true
 *            description: id of the user to convert to a superadmin
 * responses:
 *    '201':
 *      description: Created
 *    '404':
 *      description: User not found
 *    '401':
 *      description: Unauthorized.
 *    '400':
 *      description: Bad Request
 * 
*/ 
router.patch('/make-super-admin/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const user = await repository.get_user_by_id(id);
        if (!user) {
            helpers.log_request_error(`PATCH users/make-super-admin/${id} - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH users/make-super-admin/${id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH users/make-super-admin/${id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`PATCH users/make-super-admin/${id} - 401: Unauthorized access. Only a superadmin can make superadmins`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can make superadmins'});
        }

        const result =  await repository.make_super_admin(user);

        helpers.log_request_info(`PATCH users/make-super-admin/${id} - 200`);
        res.status(201).json(result);

    } catch (error) {
        helpers.log_request_error(`PATCH users/make-super-admin/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/all:
 *  get:
 *      summary: Gets all users
 *      description: |
 *          Only the superadmin has access to get
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            required: false
 *            description: the page to start from. Defaults to first page if not specified
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            required: true
 *            description: the page to start from. Defaults to 20 if not specified.
 * responses:
 *    '200':
 *      description: Ok
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/all', async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20;

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET users/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`GET users/all - 401: Unauthorized access. Only a superadmin can view all users`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can view all users'});
        }

        const result = await repository.get_all_users(page, limit);

        helpers.log_request_info(`GET users/all - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET users/all - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/admin-publish-request/{institute_id}/{resource_id}:
 *  post:
 *      summary: Creates a request for the superadmin to publish a resource to the public
 *      description: |
 *          Only an institute admin can make this request.
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: institute_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to publish from
 *          - in: path
 *            name: resource_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the resource requesting to be published
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '409':
 *      description: Request already exists
*/
router.post('/admin-publish-request/:institute_id/:resource_id', async (req, res) => {
    try {
        const institute_id = req.params.institute_id;
        const resource_id = req.params.resource_id;

        if (!req.headers.authorization) {
            helpers.log_request_error(
                `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 401: Token not found`
            )
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(
                `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 
                ${validateUser.status}: ${ validateUser.message}`
            )
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) {
            helpers.log_request_error(
                `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 
                401: Only institute admins can request to publish resources`
            )
            return res.status(401).json({message: "Only institute admins can request to publish resources"})
        }

        const resource = await repository.get_resource_by_id(resource_id);
        if (!resource) {
            helpers.log_request_error(
                `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 
                404: Resource ${resource_id} not found`
            )
            return res.status(404).json({message: `Resource ${resource_id} not found`});
        }

        const pub_request = await repository.find_request_by_resource(resource_id)
        if (pub_request) {
            helpers.log_request_error(
                `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 
                409: request for publishing already exists for resource ${resource_id}`
            )
            return res.status(409).json({message: `request for publishing already exists for resource ${resource_id}`})
        }
        
        const isPublic = await helpers.validatePublicResource(resource_id);
        if (isPublic) {
            helpers.log_request_error(
                `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 
                409: resource ${resource_id} already published`
            )
            return res.status(409).json({message: `resource ${resource_id} already published`});
        }

        const data = new Model.pubRequest({
            resource: resource_id,
            institute: institute_id
        });
        const result = await repository.request_to_publish(data);

        helpers.log_request_info(`POST users/admin-publish-request/${institute_id}/${resource_id} - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(
            `POST users/admin-publish-request/${req.params.institute_id}/${req.params.resource_id} - 400: ${error.message}`
        )
        res.status(400).json({error: error.message})
    }
})

/** 
 * @swagger
 * /users/admin-publish/{resource_id}:
 *  post:
 *      summary: Publishes a resource to the general public
 *      description: |
 *          Only a superadmin can publish a resource to the public
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: resource_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the resource to be published
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.post('/admin-publish/:resource_id', async (req, res) => {
    try {
        const resource_id = req.params.resource_id;
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST users/admin-publish/${req.params.resource_id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(
                `POST users/admin-publish/${req.params.resource_id} - ${validateUser.status}: ${validateUser.message}`
            )
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(
                `POST users/admin-publish/${req.params.resource_id} - 401: Unauthorized access. Only a superadmin can publish`
            )
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can publish'});
        }

        const result =  await repository.publish(resource_id);

        helpers.log_request_info(`POST users/admin-publish/${resource_id} - 200`)
        res.status(200).json({result});

    } catch (error) {
        helpers.log_request_error(`POST users/admin-publish/${req.params.resource_id} - 400: ${error.message}`)
        res.status(400).json({error: error.message})
    }
})

/** 
 * @swagger
 * /users/admin-publish-requests:
 *  get:
 *      summary: Returns all the requests for publishing.
 *      description: |
 *          Only the superadmin can view requests
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: query
 *            name: page
 *            schema:
 *              type: integer
 *            required: false
 *            description: |
 *              the page to start from. Defaults to first page if not specified. 
 *          - in: query
 *            name: limit
 *            schema:
 *              type: integer
 *            required: true
 *            description: the page to start from. Defaults to 20 if not specified.
 * responses:
 *    '201':
 *      description: updated
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/admin-publish-requests', async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET users/admin-publish-requests - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET users/admin-publish-requests - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(`GET users/admin-publish-requests - 401: Unauthorized access. Only a superadmin can view requests`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can view requests'});
        }

        const result = await repository.get_all_requests(page, limit);

        helpers.log_request_info(`GET users/admin-publish-requests - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET users/admin-publish-requests - 400: ${error.message}`)
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /users/superadmin-search:
 *  get:
 *      summary: Endpoint for the superadmin to search the entire database for resources, users and institutes.
 *      description: |
 *          Search will return data found by Users username or email, Institutes name and Research Resource topic
 *          
 *          Only the superadmin can access this endpoint         
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: query
 *            name: q
 *            schema:
 *              type: string
 *            required: true
 *            description: Any keyword to search for
 * responses:
 *    '200':
 *      description: Successful
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/superadmin-search', async (req, res) => {
    try {
        const query = req.query.q
        if (!query){
            helpers.log_request_error(`GET users/superadmin-search - 400: No query supplied`);
            return res.status(400).json({message: "No query suppliedd"});
        }
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET users/superadmin-search - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET users/superadmin-search - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(`GET users/superadmin-search - 401: Unauthorized access. Only a superadmin can view search`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can view search'});
        }

        const result = await repository.super_admin_search(query);

        helpers.log_request_info(`GET users/superadmin-search - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET users/superadmin-search - 400: ${error.message}`)
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /users/search-publish-requests:
 *  get:
 *      summary: Endpoint for the superadmin to search publication requests.
 *      description: |
 *          Only the superadmin can access this endpoint         
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: query
 *            name: q
 *            schema:
 *              type: string
 *            required: true
 *            description: Any keyword to search for
 * responses:
 *    '200':
 *      description: Successful
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/search-publish-requests', async (req, res) => {
    try {
        const query = req.query.q
        if (!query){
            helpers.log_request_error(`GET users/search-publish-requests - 400: No query supplied`);
            return res.status(400).json({message: "No query suppliedd"});
        }
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET users/search-publish-requests - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET users/search-publish-requests - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(`GET users/search-publish-requests - 401: Unauthorized access. Only a superadmin can view search`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can view search'});
        }

        const result = await repository.search_publication_requests(query);

        helpers.log_request_info(`GET users/search-publish-requests - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET users/search-publish-requests - 400: ${error.message}`)
        res.status(400).json({message: error.message})
    }
})


module.exports = router