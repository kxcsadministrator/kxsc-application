const express = require('express');
const multer = require("multer");
const validator = require('express-validator');

const Model = require('../db/models');
const repository = require('../db/repository');
const schemas = require('../schemas/institute-schema');
const helpers = require('../helpers');

const router = express.Router()

const FILE_PATH = "uploads/"
const storage = multer.diskStorage({
    destination: FILE_PATH,
    filename: (req, file, callback) => {
        const date = Date.now()
        callback(null, date.toString() + "-" + file.originalname);
    }
  });
const upload = multer({ storage: storage });

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
            return res.status(400).json({ errors: errors.array() });
        }

        // Authorization
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can create institutes'});

        const data = new Model.institute({
            name: req.body.name
        });
        const org = await repository.get_institute_by_name(req.body.name);
        if (org) return res.status(409).json({message: `institute ${req.body.name} already exists`});
        
        const dataToSave = await repository.create_new_institute(data);
        res.status(201).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /institutes/one/{id}:
 *  get:
 *      summary: Gets an institute by id
 *      description: | 
 *          Requires a bearer token for authorization.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/one/:id', async (req, res) => {
    try {
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});

        const id = req.params.id;
        const data = await repository.get_institute_data(id, req.headers);
        if (!data) return res.status(404).json({message: `insititute with id ${id} not found`});

        const isMember = await helpers.validateInstituteMembers(req.headers, id);
        if (!isMember) return res.status(401).json({message: `Unauthorized access. User not a member of institute`})
        
        res.status(200).json(data);
    } catch (error) {
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
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/all', async (req, res) => {
    try {
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can view all institutes'});

        const data = await repository.get_all_institutes();
        res.status(200).json(data);
    } catch (error) {
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
 *         ### admins: {required: true, type: [ObjectId]}
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
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const admin_data = req.body.admins;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can add admins'});
        
        const valid_users_res = await helpers.validateUserdata(admin_data);
        if (valid_users_res.status != 200) return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});

        const result = await repository.add_institute_admins(id, valid_users_res.data);
        res.status(201).json(result);
    } catch (error) {
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
 *         ### admins: {required: true, type: [ObjectId]}
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
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const admin_data = req.body.admins;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can remove admins'});

        const valid_users_res = await helpers.validateUserdata(admin_data);
        if (valid_users_res.status != 200) return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});

        const result = await repository.remove_institue_admins(id, valid_users_res.data);
        res.status(201).json(result);
    } catch (error) {
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
 *         ### members: {required: true, type: [ObjectId]}
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
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const member_data = req.body.members;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can add members"});

        const valid_users_res = await helpers.validateUserdata(member_data);
        if (valid_users_res.status != 200) return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});

        const result = await repository.add_institute_members(id, valid_users_res.data);
        res.status(201).json(result);
    } catch (error) {
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
 *         ### members: {required: true, type: [ObjectId]}
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
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const member_data = req.body.members;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can remove members"})

        const valid_users_res = await helpers.validateUserdata(member_data);
        if (valid_users_res.status != 200) return res.status(valid_users_res.status).json({message: "Invalid username(s) supplied"});

        const result = await repository.remove_institute_members(id, valid_users_res.data);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});


router.patch('/add-resources/:id',  
    validator.check('resources').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("resources field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const resources_data = req.body.resources;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can add resources"})

        const result = await repository.add_resources_to_institute(id, resources_data);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /institutes/remove-resources/{id}:
 *  patch:
 *      summary: Removes resources for a given research institute
 *      description: |
 *         You can remove multiple resources at one go.
 *         
 *          Only institute and super admins can remove resources from an institute
 *         ## Schema:
 *         ### resources: {required: true, type: [ObjectId]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to remove resources
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
router.patch('/remove-resources/:id',  
    validator.check('resources').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("resources field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const resources_data = req.body.resources;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can add resources"})

        const result = await repository.remove_resources_from_institute(id, resources_data);
        res.status(201).json(result);
    } catch (error) {
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
                return res.status(400).json({ errors: errors.array() });
            }
            const id = req.params.id;
            const data = await repository.get_institute_by_id(id);
            if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

            if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
            const user = validateUser.data;

            if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can rename institutes'});

            const name = req.body.name;
            const result = await repository.edit_institute_name(id, name);
            res.status(201).json(result);
        } catch (error) {
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
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        const institute_id = req.params.id;
        const resource_id = req.params.resource_id;

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) return res.status(404).json({message: `institute with id ${institute_id} not found`});

        const pub_request = await repository.find_request_by_resource(resource_id)
        if (pub_request) return res.status(409).json({message: `request for publishing already exists for resource ${resource_id}`})

        const ins = await  repository.get_institute_by_id(institute_id)
        if (ins.resources.includes(resource_id)) return res.status(409).json(
            { message:`resource ${resource_id} already published under institute ${institute_id}` }
        )

        const isOwner = helpers.validateUserResource(user, resource_id);
        if (!isOwner) return res.status(401).json({message: `User ${user._id} is not the owner of resource ${resource_id}`});

        const data = new Model.pubRequest({
            resource: resource_id,
            institute: institute_id
        });
        const result = await repository.request_to_publish(data)
        res.status(200).json(result);

    } catch (error) {
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
        if (!institute) return res.status(404).json({message: `institute with id ${institute_id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can request to publish resources"})

        const data = await helpers.admin_publish_request(institute_id, resource_id, req.headers);
        res.status(200).json(data);

    } catch (error) {
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
        if (!institute) return res.status(404).json({message: `institute with id ${institute_id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can publish resources"})

        const result = await repository.publish(institute_id, resource_id);
        res.status(200).json(result);

    } catch (error) {
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
        if (!institute) return res.status(404).json({message: `institute with id ${institute_id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can view requests"});

        const result = await repository.get_institute_requests(institute_id);
        res.status(200).json(result);
    } catch (error) {
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

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can delete institutes'});

        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        const result = await repository.delete_institute(id);
        res.status(204).json({message: `institute with id: ${id} deleted successfully`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institutes/{id}/files:
 *  get:
 *      summary: Gets all institutes files for a given institute id. 
 *      description: |
 *          The returned files are the files made public by the institute admin
 * 
 *          Requires a bearer token for authentication.
 * responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get('/:id/files', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await repository.get_institute_by_id(id);
        if (!data) return res.status(404).json({message: `institute with id: ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const result = await repository.get_institute_files(id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message})
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
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can get metrics'});

        const result = await repository.get_institute_count();
        res.status(200).json({count: result})
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institutes/upload-files/{id}:
 *  post:
 *      summary: Uploads a file/files to the server.
 *      description: |
 *          Uploads a file or a group of files. Only the institute admin can upload files.
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          Accepts a form-data with the key "files"
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to upload the files to
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.post("/upload-files/:id", upload.array("files"), async (req, res) => {
    try {
        const files = req.files;
        const id = req.params.id;

        if (!files) return res.status(400).json({message: "No file selected"});

        const institute = await repository.get_institute_by_id(id);
        if (!institute) return res.status(404).json({message: `institute ${id} not found`});

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) return res.status(401).json({message: "Only institute admins can upload files"})

        let data = []
        
        files.map(p =>
            data.push({
                name: p.filename,
                original_name: p.originalname,
                path: `${FILE_PATH}${p.filename}`,
                parent: id
            })
        )
        const result =  await repository.add_institute_file(id, data);
        res.status(201).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institutes/download-files:
 *  get:
 *      summary: Downloads a file from the server.
 *      description: |
 *        The request should have a query parameter 'name'.
 *        
 *        This param should match the 'name' of a file object and not original_filename.
 * 
 *        Requires a bearer token for authentication.
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get("/download-file/:id", async (req, res) => {
    
    try {
        const id = req.params.id;
        const file_name = req.query.name;

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const institute = await repository.get_institute_by_id(id);
        if (!institute) return res.status(400).json({message: `institute with id: ${id} not found`});
        if (!file_name) return res.status(400).json({message: "no filename provided"});
        
        const result = await repository.get_one_institute_file(file_name);
        if (!result) return res.status(404).json({message: `file ${file_name} not found`});
        
        res.download(result.path, result.original_name);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;