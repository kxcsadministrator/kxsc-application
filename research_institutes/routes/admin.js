const express = require('express');
const multer = require("multer");
const validator = require('express-validator');

const Model = require('../db/models');
const repository = require('../db/repository');
const schemas = require('../schemas/institute-schema');
const helpers = require('../helpers');

const router = express.Router()


/** 
 * @swagger
 * /institutes/new:
 *  post:
 *      summary: Inserts a new research institute into the db
 *      description: |
 *          Only superadmins can create institutes. 
 * 
 *          Requires a bearer token for authorization.
 * 
 *          ## Schema
 *          ### name: {required: true, type: string}
 * responses:
 *    '201':
 *      description: Created
 *    '409':
 *      description: Organization already exists
 *    '400':
 *      description: Bad request
*/
router.post('/new', validator.checkSchema(schemas.newInstituteSchema), async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST institutes/new - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        // Authorization
        if (!req.headers.authorization){
            helpers.log_request_error(`POST institutes/new - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST institutes/new -${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`POST institutes/new - 401: Unauthorized access. Only superadmins can create institutes`) 
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can create institutes'});
        }

        const data = new Model.institute({
            name: req.body.name
        });
        const org = await repository.get_institute_by_name(req.body.name);
        if (org) {
            helpers.log_request_error(`POST institutes/new - 409: Institute already exists`) 
            return res.status(409).json({message: `institute ${req.body.name} already exists`});
        }
        
        const dataToSave = await repository.create_new_institute(data);

        helpers.log_request_info(`POST institutes/new - 201`) 
        res.status(201).json(dataToSave);
    } catch (error) {
        helpers.log_request_error(`POST institutes/new - 400: ${error.message}`) 
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /institutes/all:
 *  get:
 *      summary: Gets all institutes
 *      description: |
 *           Returns the results from newest to oldest by default
 * 
 *           Requires a bearer token for authorization.
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
 *    '400':
 *      description: Bad request
*/
router.get('/all', async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/all - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET institutes/all - ${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`GET institutes/all - 401: Unauthorized access. Only superadmins can view all institutes`) 
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can view all institutes'});
        }

        const data = await repository.get_all_institutes(page, limit);

        helpers.log_request_info(`GET institutes/all - 200`) 
        res.status(200).json(data);
    } catch (error) {
        helpers.log_request_error(`GET institutes/all - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institutes/add-admins/{id}:
 *  patch:
 *      summary: Adds admins for a given research institute using their username or email
 *      description: |
 *         You can add multiple admins in one go.
 *         The usernames/emails provided will be validated. An error will be returned if there are no users with such data
 *         ## Schema:
 *         ### admins: {required: true, type: [String]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to add admins
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
router.patch('/add-admins/:id',  
    validator.check('admins').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("admins field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - 400: validation errors`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const admin_data = req.body.admins;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - ${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - 401: Unauthorized access. Only superadmins can add admins`) 
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can add admins'});
        }
        
        const valid_users_res = await helpers.validateUserdata(admin_data);
        if (valid_users_res.status != 200) {
            helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - ${valid_users_res.status}: Invalid username(s) supplied`) 
            return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});
        }

        const result = await repository.add_institute_admins(id, valid_users_res.data);

        helpers.log_request_info(`PATCH institutes/add-admins/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/add-admins/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /institutes/remove-admins/{id}:
 *  patch:
 *      summary: Remove admins for a given research institute by username or email
 *      description: |
 *         You can remove multiple admins at one go.
 * 
 *         The usernames/emails provided will be validated. An error will be returned if there are no users with such data
 *         ## Schema:
 *         ### admins: {required: true, type: [String]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to remove admins
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
router.patch('/remove-admins/:id',  
    validator.check('admins').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("admins field must be a non-empty array");
        return true;
    }),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - 404: Institute not found`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const admin_data = req.body.admins;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - ${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - 401: Unauthorized access. Only superadmins can remove admins`) 
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can remove admins'});
        }

        const valid_users_res = await helpers.validateUserdata(admin_data);
        if (valid_users_res.status != 200) {
            helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - ${valid_users_res.status}: Invalid username(s) supplied`) 
            return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});
        }

        const result = await repository.remove_institue_admins(id, valid_users_res.data);

        helpers.log_request_info(`PATCH institutes/remove-admins/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/remove-admins/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /institutes/add-members/{id}:
 *  patch:
 *      summary: Adds members for a given research institute by username or email
 *      description: |
 *         You can add multiple members at one go.
 *          
 *         The usernames/emails provided will be validated. An error will be returned if there are no users with such data
 *         ## Schema:
 *         ### members: {required: true, type: [String]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to add members
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
router.patch('/add-members/:id',  
    validator.check('members').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("members field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH institutes/add-members/${req.params.id} - 400: validation errors`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const member_data = req.body.members;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/add-members/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/add-members/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) {
            helpers.log_request_error(`PATCH institutes/add-members/${req.params.id} - 401: Unauthorized access. Only institute admin can add members`) 
            return res.status(401).json({message: "Only institute admins can add members"});
        }

        const valid_users_res = await helpers.validateUserdata(member_data);
        if (valid_users_res.status != 200) {
            helpers.log_request_error(`PATCH institutes/add-members/${req.params.id} - ${valid_users_res.status}: Invalid username(s) supplied`) 
            return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});
        }

        const result = await repository.add_institute_members(id, valid_users_res.data);

        helpers.log_request_info(`PATCH institutes/add-members/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/add-members/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /institutes/remove-members/{id}:
 *  patch:
 *      summary: Removes members for a given research institute by username or email
 *      description: |
 *         You can remove multiple members at one go.
 * 
 *         The usernames/emails provided will be validated. An error will be returned if there are no users with such data
 *         ## Schema:
 *         ### members: {required: true, type: [String]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to remove members
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
router.patch('/remove-members/:id',  
    validator.check('members').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("members field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH institutes/remove-members/${req.params.id} - 400: validation errors`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const member_data = req.body.members;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/remove-members/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/remove-members/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) {
            helpers.log_request_error(`PATCH institutes/remove-members/${req.params.id} - 401: Unauthorized access. Only institute admins can remove members`) 
            return res.status(401).json({message: "Only institute admins can remove members"})
        }

        const valid_users_res = await helpers.validateUserdata(member_data);
        if (valid_users_res.status != 200) {
            helpers.log_request_error(`PATCH institutes/remove-members/${req.params.id} - ${valid_users_res.status}: Invalid username(s) supplied`) 
            return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});
        }

        const result = await repository.remove_institute_members(id, valid_users_res.data);

        helpers.log_request_info(`PATCH institutes/remove-members/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/remove-members/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /institutes/update/{id}:
 *  patch:
 *      summary: Updates an institute
 *      description: |
 *          Updates many fields at one go. Not recommended to be used for add/remove operations
 *          Only institute and super admins can update an institute
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to update
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
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/update/${req.params.id} - 404: institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/update/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH institutes/update/${req.params.id} - ${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`PATCH institutes/update/${req.params.id} - 401: Only superadmins can update institutes`) 
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can update institutes'});
        }

        const name = req.body.name;
        const dup_name = await repository.get_institute_by_name(req.body.name);
        if (dup_name){
            helpers.log_request_error(`PATCH institutes/update/${req.params.id} - 409: Duplicate name`)
            return res.status(409).json({message: `An institute with ${name} already exists`})
        }
        const result = await repository.update_institute(id, req.body);

        helpers.log_request_info(`PATCH institutes/update/${req.params.id} - 201`) 
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/update/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});

/** 
* @swagger
* /institutes/rename/{id}:
*  patch:
*      summary: Renames the name of an institute
*      description: |
*          Only institute and super admins can edit the name of an institute
* 
*          Requires a bearer token for authentication
*         ## Schema:
*         ### name: {required: true, type: String}
*      parameters: 
*          - in: path
*            name: id
*            schema:
*              type: UUID/Object ID
*            required: true
*            description: id of the institute to rename
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
router.patch('/rename/:id', 
validator.check("name").notEmpty().withMessage("name field must be a non-empty string"), 
async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH institutes/rename/${req.params.id} - 400: validation errors`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/rename/${req.params.id} - 404: institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/rename/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH institutes/rename/${req.params.id} - ${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`PATCH institutes/rename/${req.params.id} - 401: Unauthorized access. Only superadmins can rename institutes`) 
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can rename institutes'});
        }

        const name = req.body.name;
        const result = await repository.edit_institute_name(id, name);

        helpers.log_request_info(`PATCH institutes/rename/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/rename/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});


/** 
 * @swagger
 * /institutes/institute-publish-request/{id}/{resource_id}:
 *  post:
 *      summary: Creates a request to publish a resource institute wide
 *      description: |
 *          Only the owner of a resource can request for it to be published.
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to publish to
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
 *    '409':
 *      description: Request already exists
 *    '401':
 *      description: Unauthorized
*/
router.post('/institute-publish-request/:id/:resource_id', async(req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(
                `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 401: Token not found`
            ) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(
                `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - ${validateUser.status}: ${validateUser.message}`
            )
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const institute_id = req.params.id;
        const resource_id = req.params.resource_id;

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(
                `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 404: institute not found`
            )
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }

        const pub_request = await repository.find_request_by_resource(resource_id)
        if (pub_request) {
            helpers.log_request_error(
                `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 409: duplicate request`
            )
            return res.status(409).json({message: `request for publishing already exists for resource ${resource_id}`})
        }

        const ins = await  repository.get_institute_by_id(institute_id)
        if (ins.resources.includes(resource_id)) {
            helpers.log_request_error(
                `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 409: already published`
            )
            return res.status(409).json(
                { message:`resource ${resource_id} already published under institute ${institute_id}` }
            )
        }
       
        // const isOwner = helpers.validateUserResource(user, resource_id);
        // if (!isOwner) {
        //     helpers.log_request_error(
        //         `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 401: unauthorized owner`
        //     )
        //     return res.status(401).json({message: `User ${user._id} is not the owner of resource ${resource_id}`});
        // }

       
        const data = new Model.pubRequest({
            resource: resource_id,
            institute: institute_id,
        });
        const result = await repository.request_to_publish(data);

        helpers.notify_institute(institute_id, req.headers)
        helpers.log_request_info(`POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 200`)
        res.status(200).json(result);

    } catch (error) {
        console.error(error)
        helpers.log_request_error(
            `POST institutes/institute-publish-request/${req.params.id}/${req.params.resource_id} - 400: ${error.message}`
        )
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /institutes/request-to-publish/{id}/{resource_id}:
 *  post:
 *      summary: Makes a request to the superadmin to publish a resource to the public
 *      description: |
 *          Only Institute admins can make this request.
 *          
 *          Requires a bearer token to be sent as part of authorization headers
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute requesting a publish
 *          - in: path
 *            name: resource_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the resource to be published by superadmin
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.post('/request-to-publish/:id/:resource_id', 
    async(req, res) => {
    try {
        const institute_id = req.params.id
        const resource_id = req.params.resource_id;

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(
                `POST institutes/request-to-publish/${req.params.id}/${req.params.resource_id} - 404: Institute not found`
            ) 
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(
                `POST institutes/request-to-publish/${req.params.id}/${req.params.resource_id} - 401: Token not found`
            )
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) {
            helpers.log_request_error(
                `POST institutes/request-to-publish/${req.params.id}/${req.params.resource_id} - 401: Only institute admins can request`
            ) 
            return res.status(401).json({message: "Only institute admins can request to publish resources"})
        }

        const data = await helpers.admin_publish_request(institute_id, resource_id, req.headers);

        helpers.log_request_info(`POST institutes/request-to-publish/${req.params.id}/${req.params.resource_id} - 200`) 
        res.status(200).json(data);

    } catch (error) {
        helpers.log_request_error(
            `POST institutes/request-to-publish/${req.params.id}/${req.params.resource_id} - 400: ${error.message}`
        )
        if (error.response.data.message) error.message = error.response.data.message;
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /institutes/publish-to-institute/{id}/{resource_id}:
 *  post:
 *      summary: Publishes a resource institute-wide
 *      description: |
 *          Only the admin of a resource and a superadmin can publish a resource institute wide
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to publish to
 *          - in: path
 *            name: resource_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the resource to be published
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.post('/publish-to-institute/:id/:resource_id', 
    async(req, res) => {
    try {
        const institute_id = req.params.id
        const resource_id = req.params.resource_id;

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(
                `POST institutes/publish-to-institute/${req.params.id}/${req.params.resource_id} - 404: Institute not found`
            ) 
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(
                `POST institutes/publish-to-institute/${req.params.id}/${req.params.resource_id} - 401: Token not found`
            )
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) {
            helpers.log_request_error(
                `POST institutes/publish-to-institute/${req.params.id}/${req.params.resource_id} - 401: Only institute admins can publish`
            )
            return res.status(401).json({message: "Only institute admins can publish resources"})
        }

        const result = await repository.publish(institute_id, resource_id);

        helpers.log_request_info(`POST institutes/publish-to-institute/${req.params.id}/${req.params.resource_id} - 200`)
        res.status(200).json(result);

    } catch (error) {
        helpers.log_request_error(
            `POST institutes/publish-to-institute/${req.params.id}/${req.params.resource_id} - 400: ${error.message}`
        )
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /institutes/publish-requests/{id}:
 *  get:
 *      summary: Returns all the requests for publishing that institute members have made
 *      description: |
 *          Only the admin of an institute can view requests
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to view all requests
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/publish-requests/:id', async (req, res) => {
    try {
        const institute_id = req.params.id;

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(`GET institutes/publish-requests/${req.params.id} - 404: Institute not found`)
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/publish-requests/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) {
            helpers.log_request_error(`GET institutes/publish-requests/${req.params.id} - 401: Only institute admins can view`)
            return res.status(401).json({message: "Only institute admins can view requests"});
        }

        const result = await repository.get_institute_requests(institute_id);

        helpers.log_request_info(`GET institutes/publish-requests/${req.params.id} - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET institutes/publish-requests/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message})
    }
})


/** 
 * @swagger
 * /institutes/new-user-request/{id}:
 *  post:
 *      summary: Makes a request to the superadmin to create a new user account
 *      description: |
 *          Only Institute admins can make this request. Upon creation, the user is automatically added as a member of the institute.
 *          
 *          Requires a bearer token to be sent as part of authorization headers
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute requesting a new user
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.post('/new-user-request/:id', 
validator.check("username").isLength({min: 3}).withMessage("username must be at least 3 characters long"),
validator.check("email").isLength({min: 3}).withMessage("email must be at least 3 characters long"),
    async(req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST users/new-user-request/${req.params.id}- 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }
        
        const institute_id = req.params.id
        const username = req.body.username
        const email = req.body.email

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(`POST institutes/new-user-request/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`POST institutes/new-user-request/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);

        if (!isAdmin) {
            helpers.log_request_error(`POST institutes/new-user-request/${req.params.id} - 401: Only institute admins can request`) 
            return res.status(401).json({message: "Only institute admins can request to publish resources"})
        }

        const data = await helpers.admin_new_user_request(institute_id, username, email, req.headers);

        helpers.log_request_info(`POST institutes/new-user-request/${req.params.id} - 200`) 
        res.status(200).json(data.data);

    } catch (error) {
        helpers.log_request_error(`POST institutes/new-user-request/${req.params.id} - 400: ${error.message}`)
        if (error.response.data.message) error.message = error.response.data.message;
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /institutes/delete/{id}:
 *  delete:
 *      summary: Delete an institute
 *      description: |
 *          Deletes an institute given an id. Only the superadmin can delete an institute.
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to delete
 *  responses:
 *    '204':
 *      description: deleted
 *    '404':
 *      description: Not not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.delete("/delete/:id", async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`DELETE institutes/delete/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`DELETE institutes/delete/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`DELETE institutes/delete/${req.params.id} - 401: Only superadmins can delete institutes`)
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can delete institutes'});
        }

        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`DELETE institutes/delete/${req.params.id} - 404: Institute not found`)
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        const result = await repository.delete_institute(id);

        helpers.log_request_info(`DELETE institutes/delete/${req.params.id} - 204`)
        res.status(204).json({message: `institute with id: ${id} deleted successfully`});
    } catch (error) {
        helpers.log_request_error(`DELETE institutes/delete/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /count:
 *  get:
 *      summary: Gets the total number of institutes in the database
 *      description: |
 *          Requires a bearer token for authentication.
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/count', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/count - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET institutes/count - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`GET institutes/count - 401: Only superadmins can get metrics`)
            return res.status(401).json({message: 'Unauthorized access. Only superadmins can get metrics'});
        }

        const result = await repository.get_institute_count();

        helpers.log_request_info(`GET institutes/count - 200`)
        res.status(200).json({count: result})
    } catch (error) {
        helpers.log_request_error(`GET institutes/count - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})


/** 
 * @swagger
 * /institutes/delete-file/{id}:
 *  delete:
 *      summary: Deletes an instutute fike by it's id.
 *      description: |
 *        Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the file to be deleted
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.delete("/delete-file/:id", async (req, res) => {
    
    try {
        const id = req.params.id;
        
        const file = await repository.get_institute_file_by_id(id)
        if (!file){
            helpers.log_request_error(`DELETE institutes/delete-files/${req.params.id} - 404: File not found`)
            return res.status(404).json(`File ${id} not found`)
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/delete-files/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, file.parent.id.toString());
        if (!isAdmin) {
            helpers.log_request_error(`DELETE institutes/delete-files/${req.params.id} - 401: Only institute admins can delete files`)
            return res.status(401).json({message: "Only institute admins can delete files"})
        }
        

        helpers.log_request_info(`DELETE institutes/delete-files/${req.params.id} - 204`)
        const result = await repository.delete_institute_file(id);
        res.status(204).json({result})
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`DELETE institutes/delete-files/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

module.exports = router