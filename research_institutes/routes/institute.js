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
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/one/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }

        const id = req.params.id;
        const institute_data = await repository.get_institute_by_id(id)
        if (!institute_data) {
            helpers.log_request_error(`GET institutes/one/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `insititute with id ${id} not found`});
        }

        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (isAdmin){
            let data = await repository.get_institute_data(id, req.headers);
            helpers.log_request_info(`GET institutes/one/${req.params.id} - 200`) 
            return res.status(200).json(data);
        }

        const isMember = await helpers.validateInstituteMembers(req.headers, id);
        if (!isMember) {
            helpers.log_request_error(`GET institutes/one/${req.params.id} - 401: Unauthorized access. User not a member of institute`) 
            return res.status(401).json({message: `Unauthorized access. User not a member of institute`})
        }
        
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET institutes/one/${req.params.id} -${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data;
        
        let data = await repository.get_institute_data(id, req.headers, user._id.toString());

        helpers.log_request_info(`GET institutes/one/${req.params.id} - 200`) 
        res.status(200).json(data);
    } catch (error) {
        helpers.log_request_error(`GET institutes/one/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /institutes/my-institutes:
 *  get:
 *      summary: Gets all the institutes that the user making the request is a part of.
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
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/my-institutes', async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/my-institutes - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET institutes/all - ${validateUser.status}: ${validateUser.message}`) 
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (user.superadmin) {
            helpers.log_request_error(`GET institutes/my-institutes - 200`)
            const data = await repository.get_all_institutes(page, limit); 
            return res.status(200).json(data)
        }

        const data = await repository.get_user_institutes(page, limit, user._id.toString());

        helpers.log_request_info(`GET institutes/my-institutes - 200`) 
        res.status(200).json(data);
    } catch (error) {
        helpers.log_request_error(`GET institutes/my-institutes - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
})




router.patch('/add-resources/:id',  
    validator.check('resources').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("resources field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH institutes/add-resources/${req.params.id} - 400: validation errors`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const resources_data = req.body.resources;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/add-resources/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/add-resources/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) {
            helpers.log_request_error(`PATCH institutes/add-resources/${req.params.id} - 401: Unauthorized access. Only institute admins can add resources`) 
            return res.status(401).json({message: "Only institute admins can add resources"})
        }

        const result = await repository.add_resources_to_institute(id, resources_data);

        helpers.log_request_info(`PATCH institutes/add-resources/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/add-resources/${req.params.id} - 400: ${error.message}`) 
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
            helpers.log_request_error(`PATCH institutes/remove-resources/${req.params.id} - 400: validation errors`) 
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const resources_data = req.body.resources;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`PATCH institutes/remove-resources/${req.params.id} - 404: Institute not found`) 
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH institutes/remove-resources/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        // const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        // if (!isAdmin) {
        //     helpers.log_request_error(`PATCH institutes/add-resources/${req.params.id} - 401: Unauthorized access. Only institute admins can remove resources`) 
        //     return res.status(401).json({message: "Only institute admins can add resources"})
        // }

        const result = await repository.remove_resources_from_institute(id, resources_data);

        helpers.log_request_info(`PATCH institutes/remove-resources/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH institutes/remove-resources/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /institutes/{id}/files:
 *  get:
 *      summary: Gets all institutes files for a given institute id. 
 *      description: |
 *          The returned files are the files made public by the institute admin
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
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get('/:id/files', async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20
        const id = req.params.id;
        const data = await repository.get_institute_by_id(id);
        if (!data) {
            helpers.log_request_error(`GET institutes/${req.params.id}/files - 404: Institute not found`)
            return res.status(404).json({message: `institute with id: ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/${req.params.id}/files - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET institutes/${req.params.id}/files - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const result = await repository.get_institute_files(page, limit, id);

        helpers.log_request_info(`GET institutes/${req.params.id}/files - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET institutes/${req.params.id}/files - 400: ${error.message}`)
        res.status(400).json({message: error.message})
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

        if (!files) {
            helpers.log_request_error(`POST institutes/upload-files/${req.params.id} - 400: validation errors`)
            return res.status(400).json({message: "No file selected"});
        }

        const institute = await repository.get_institute_by_id(id);
        if (!institute) {
            helpers.log_request_error(`POST institutes/upload-files/${req.params.id} - 404: Institute not found`)
            return res.status(404).json({message: `institute ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`POST institutes/upload-files/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, id);
        if (!isAdmin) {
            helpers.log_request_error(`POST institutes/upload-files/${req.params.id} - 401: Only institute admins can upload files`)
            return res.status(401).json({message: "Only institute admins can upload files"})
        }

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

        helpers.log_request_info(`POST institutes/upload-files/${req.params.id} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`POST institutes/upload-files/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institutes/download-file/{id}:
 *  get:
 *      summary: Downloads a file from the server.
 *      description: |
 *        Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the file to be downloaded
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
        const file_id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET institutes/download-files/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET institutes/download-files/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const file = await repository.get_one_institute_file(file_id);
        if (!file) {
            helpers.log_request_error(`GET institutes/download-files/${req.params.id} - 404: file not found`)
            return res.status(404).json({message: "file not found"});
        }

        const isMember = await helpers.validateInstituteMembers(req.headers, file.parent._id.toString())
        if (!isMember) {
            helpers.log_request_error(`GET institutes/download-files/${req.params.id} - 401: Only institute members can download files`)
            return res.status(401).json({message: "Only institute members can download files"})
        }
    
        helpers.log_request_info(`GET institutes/download-files/${req.params.id} - 200`)
        res.download(file.path, file.original_name);
    } catch (error) {
        // console.error(error)
        helpers.log_request_error(`GET institutes/download-files/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});



/** 
 * @swagger
 * /institute/{id}/search-member:
 *  get:
 *      summary: Gets a member via the username or email
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: ID of the institute to search through
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *            description: username of the member to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/:id/search-member', async (req, res) => {
    try {
        const name = req.query.name
        const id = req.params.id
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/username/${name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const members = await repository.search_institute_members(id, name, token);

        helpers.log_request_info(`GET users/username/${name} - 200`)
        res.status(200).json(members);
    } catch (error) {
        helpers.log_request_error(`GET users/username/${req.params.name} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institute/{id}/search-resource:
 *  get:
 *      summary: Gets a resource for a given institute by name
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: ID of the institute to search through
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *            description: username of the member to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/:id/search-resource', async (req, res) => {
    try {
        const name = req.query.name
        const id = req.params.id
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET institutes/${id}/search-resource/${name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const members = await repository.search_institute_resources(id, name, token);

        helpers.log_request_info(`GET institutes/${id}/search-resource/${name} - 200`)
        res.status(200).json(members);
    } catch (error) {
        helpers.log_request_error(`GET institutes/${req.params.id}/search-resource/${req.query.name} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /institute/{id}/search-publish-requests:
 *  get:
 *      summary: Gets a publish request for a given institute by name
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: ID of the institute to search through
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *            description: username of the member to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/:id/search-publish-requests', async (req, res) => {
    try {
        const name = req.query.name
        const id = req.params.id
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET institutes/${id}/search-publish-requests?${name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const requests = await repository.search_publication_requests(name, id, token)

        helpers.log_request_info(`GET institutes/${id}/search-publish-requests?${name} - 200`)
        res.status(200).json(requests);
    } catch (error) {
        helpers.log_request_error(`GET institutes/${req.params.id}/search-publish-requests?${req.query.name} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

module.exports = router;