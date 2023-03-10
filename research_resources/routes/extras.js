/*--------------------------------------------- extras ---------------------------------------------*/
/* This file is an extension of resources.js */
const express = require('express');
const multer = require("multer");
const validator = require("express-validator");

const repository = require('../db/repository');
const helpers = require('../helpers');
const schemas = require('../schemas/resource-schemas');

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
 * /resources/rate:
 *  post:
 *      summary: Rates a resource given an id from 1 to 5
 *      description: |
 *          Throws an error if value provided is not in the range 1 to 5
 * 
 *          Requires a bearer token for authentication
 *          ## Schema
 *          ### id: {required: true, type: string}
 *          ### value: {required: true, type: number, min: 1, max: 5}
 * responses:
 *    '201':
 *      description: Ok
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.post('/rate/:id/:score',  
    async (req, res) => {
    try {
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error('POST resources/rate - 401: Token not found')
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200){ 
            helpers.log_request_error(`POST resources/rate - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`POST resources/rate - 404: Resource not found`)
            res.status(404).json({message: "Resource not found"}); 
        }

        const hasRated = await repository.validateRate(user._id.toString(), resource._id);
        if (hasRated) {
            helpers.log_request_error(`POST resources/rate - 409: User ${user._id} has already rated resource ${resource._id.toString()}`)
            return res.status(409).json({message: `User ${user._id} has already rated resource ${resource._id.toString()}`});
        }

        const data = await repository.rate_resource(req.params.id, user._id.toString(), req.params.score);

        helpers.log_request_info(`POST resources/rate - 200`)
        res.status(200).json(data);
    }
    catch (error) {
        helpers.log_request_error(`POST resources/rate - 400: ${error.message}`)
        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /rating/{id}:
 *  get:
 *      summary: Gets all the average rating for a resource
 *      description: >
 *           Gets the rating for a resource given an id
 *           An average of 0 essentially means the resource hasn't been rated yet
 * 
 *           Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to get the average rating
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
 *    '404':
 *      description: resource not found
*/
router.get('/rating/:id', async (req, res) => {
    try{
        const resource = await repository.get_resource_by_id(req.params.id)
        const data = await repository.get_rating(req.params.id);
        if (resource.visibility == "public"){
            return res.status(200).json(data);
        }

        // Authorization and validation
        if (!req.headers.authorization){ 
            helpers.log_request_error(`GET resources/rating/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET resources/rating/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (user._id.toString() == resource.author && user.superadmin == false) {
            helpers.log_request_error(`GET resources/rating/${req.params.id} - 404: Resource not found`)
            return res.status(404).json({message: "Resource not found"});
        }

        helpers.log_request_info(`GET resources/rating/${req.params.id} - 200`)

        return res.status(200).json(data);
    }
    catch(error){
        helpers.log_request_error(`GET resources/rating/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /search:
 *  get:
 *      summary: Performs full-text search for a given query
 *      description: >
 *           This will search everything in the order:
 *           topic->descriptions->authors->category and returns the best matches.
 *           It may also not return any result.
 *           
 *           Requires a bearer token to be sent as part of authorization headers
 *      parameters: 
 *          - in: query
 *            name: query
 *            schema:
 *              type: string
 *            required: true
 *            description: The query you wish to search for
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/search', async (req, res) => {
    try {
        if (!req.query.query) {
            helpers.log_request_error(`GET resources/search - 400: validation errors`)
            return res.status(400).json({message: "query must be a non-empty string"});
        }
        const data = await repository.search_resource(req.query.query)

        helpers.log_request_info(`GET resources/search - 200`)
        res.status(200).json(data)
    } catch (error) {
        helpers.log_request_error(`GET resources/search - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
    
})
/** 
 * @swagger
 * /similar/{id}:
 *  get:
 *      summary: Performs similar document retrieval using BM25 for a given query
 *      description: > 
 *          Returns the top 10 most similar results in the order of most similar to least similar
 *          Uses the description of the resources as corpus for the algorithm
 *          
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: Object ID
 *            required: true
 *            description: The id of the resource you wish to obtain similar resources for
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/similar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resource = await repository.get_resource_by_id(id);
        if (!resource) {
            helpers.log_request_error(`GET resources/similar/${req.params.id} - 404: Resource not found`)
            return res.status(404).json({message: "Resource not found"});
        }

        let query = resource.topic
        if (resource.description) query = resource.description

        console.log(query)
        const result = await repository.similarity(query, id);

        helpers.log_request_info(`GET resources/similar/${req.params.id} - 200`)
        res.status(200).json(result)
    } catch (error) {
        helpers.log_request_error(`GET resources/similar/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
    
})

/** 
 * @swagger
 * /resources/update-avatar/{id}:
 *  post:
 *      summary: Changes the avatar for a given resource
 *      description: |
 *          Only the superadmin or author can update
 * 
 *          Requires a bearer token for authentication
 *          ## Schema
 *          Accepts a form-data with the key "avatar"
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: Object ID
 *            required: true
 *            description: The id of the resource you wish to update the avatar
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
router.post("/update-avatar/:id", upload.single("avatar"), async (req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const file = req.file;
        const resource_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!resource_id) {
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No resource provided"})
        }
        if (!file) {
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No file selected"})
        }

        if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")){
            helpers.log_request_error(`POST resources/update-avatar/${id} - 400: only .png, .jpg and .jpeg format allowed`)
            return res.status(400).json({message: "only .png, .jpg and .jpeg format allowed"});
        }

        if (file.size > 2000000) {
            helpers.log_request_error(`POST resources/update-avatar/${id} - 400: File exceeded 2MB size limit`)
            return res.status(400).json({message: "File exceeded 2MB size limit"});
        }
        
        // if both resources and files were provided
        const resource_data = await repository.get_resource_by_id(resource_id)
        if (!resource_data) {
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - '404': Resource with id: ${resource_id} not found`)
            return res.status(404).json({message: `Resource with id: ${resource_id} not found`})
        }
        
        if (user._id.toString() != resource_data.author && user.superadmin == false) {
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - '401': Unauthorized access to update`)
            return res.status(401).json({message: 'Unauthorized access to upload'});
        }

        const avatar_path = `${FILE_PATH}${file.filename}`
        const result = await repository.update_resource_avatar(resource_id, avatar_path);

        helpers.log_request_info(`POST resources/update-avatar/${req.params.id} - 200`)
        res.status(200).json(result); 
        
    } 
    catch (error) {
        helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /resources/remove-avatar/{id}:
 *  post:
 *      summary: Removes the avatar for a given resource
 *      description: |
 *          Only the superadmin or author can update
 * 
 *          Requires a bearer token for authentication
 *          
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: Object ID
 *            required: true
 *            description: The id of the resource you wish to remove the avatar
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
router.post("/remove-avatar/:id", async (req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST resources/remove-avatar/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST resources/remove-avatar/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const file = req.file;
        const resource_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!resource_id) {
            helpers.log_request_error(`POST resources/remove-avatar/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No resource provided"})
        }
       
        
        // if both resources and files were provided
        const resource_data = await repository.get_resource_by_id(resource_id)
        if (!resource_data) {
            helpers.log_request_error(`POST resources/remove-avatar/${req.params.id} - '404': Resource with id: ${resource_id} not found`)
            return res.status(404).json({message: `Resource with id: ${resource_id} not found`})
        }
        
        if (user._id.toString() != resource_data.author && user.superadmin == false) {
            helpers.log_request_error(`POST resources/remove-avatar/${req.params.id} - '401': Unauthorized access to remove`)
            return res.status(401).json({message: 'Unauthorized access to upload'});
        }

        const result = await repository.remove_resource_avatar(resource_id)

        helpers.log_request_info(`POST resources/remove-avatar/${req.params.id} - 200`)
        res.status(200).json(result); 
        
    } 
    catch (error) {
        helpers.log_request_error(`POST resources/remove-avatar/${req.params.id} - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /resources/upload-files/{id}:
 *  post:
 *      summary: Uploads a file/files to the server for a resource.
 *      description: |
 *          Uploads a file or a group of files
 * 
 *          Only the superadmin or author can upload files
 * 
 *          Requires a bearer token for authentication
 *          ## Schema
 *          Accepts a form-data with the key "files"
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: Object ID
 *            required: true
 *            description: The id of the resource you wish to upload files for
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
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST resources/upload-files/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST resources/upload-files/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const files = req.files;
        const resource_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!resource_id) {
            helpers.log_request_error(`POST resources/upload-files/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No resource provided"})
        }
        if (!files) {
            helpers.log_request_error(`POST resources/upload-files/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No file selected"})
        }
        
        // if both resources and files were provided
        const resource_data = await repository.get_resource_by_id(resource_id)
        if (!resource_data) {
            helpers.log_request_error(`POST resources/upload-files/${req.params.id} - '404': Resource with id: ${resource_id} not found`)
            return res.status(404).json({message: `Resource with id: ${resource_id} not found`})
        }
        
        if (user._id.toString() != resource_data.author && user.superadmin == false) {
            helpers.log_request_error(`POST resources/upload-files/${req.params.id} - '401': Unauthorized access to upload`)
            return res.status(401).json({message: 'Unauthorized access to upload'});
        }

        // if everything checks out, proceed with the rest of the function
        let data = []
        // iterate over all photos
        files.map(p =>
            data.push({
                name: p.filename,
                original_name: p.originalname,
                size: p.size,
                path: `${FILE_PATH}${p.filename}`,
                parent: resource_data._id
            })
        )
        const result = await repository.add_resource_file(resource_data._id, data);

        helpers.log_request_info(`POST resources/upload-files/${req.params.id} - 200`)
        res.status(200).json(result); 
        
    } 
    catch (error) {
        helpers.log_request_error(`POST resources/upload-files/${req.params.id} - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /resources/{resource_id}download-file/{file_id}:
 *  get:
 *      summary: Downloads a file from the server.
 *      description: |
 *        The request should have a query parameter 'name'.
 *        This param should match the 'name' of a file object and not original_filename
 * 
 *        You have to be logged in to download files
 * 
 *        Requires a bearer token for authentication  
 *      parameters: 
 *          - in: path
 *            name: resource_id
 *            schema:
 *              type: Object ID
 *            required: true
 *            description: The id of the resource you wish to download the file from
 *          - in: path
 *            name: file_id
 *            schema:
 *              type: Object ID
 *            required: true
 *            description: The id of the file you wish to download
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
router.get("/download-file/:file_id", async (req, res) => {
    const resource_id = req.params.resource_id
    const file_id = req.params.file_id;
    
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET resources/download-files/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET resources/download-files/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;
        // const resource = await repository.get_resource_by_id(resource_id);
        // if (!resource) {
        //     helpers.log_request_error(`GET resources/download-files/${req.params.id} - 404: Resource with id: ${resource_id} not found`)
        //     return res.status(404).json({message: `Resource with id: ${resource_id} not found`});
        // }

        const file = await repository.get_resource_file_by_id(file_id);
        if (!file) {
            helpers.log_request_error(`GET resources/download-files/${req.params.id} - 404: File not found`)
            return res.status(404).json({message: "File not found"});
        }

        const resource = await repository.get_resource_by_id(file.parent._id)
        if (!file) {
            helpers.log_request_error(`GET resources/download-files/${req.params.id} - 404: file not found`)
            return res.status(404).json({message: "file not found"});
        }

        if (resource.visibility != "public" && user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`GET resources/download-files/${req.params.id} - 401: Only public resources files can be downloaded`)
            return res.status(401).json({message: "Only public resources can be downloaded"});
        }
        
        helpers.log_request_info(`GET resources/download-files/${req.params.id} - 200`)

        return res.download(file.path, file.original_name);
    } catch (error) {
        helpers.log_request_error(`GET resources/download-files/${req.params.id} - 404: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /resources/{resource_id}/delete-file/{file_id}:
 *  delete:
 *      summary: Deletes a resource file
 *      description: |
 *        Requires a bearer token for authentication  
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
router.delete("/:resource_id/delete-file/:file_id", async (req, res) => {
    const resource_id = req.params.resource_id
    const file_id = req.params.file_id
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`DELETE resources/delete-file/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`DELETE resources/download-file/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const resource = await repository.get_resource_by_id(resource_id);
        if (!resource) {
            helpers.log_request_error(`GET resources/download-file/${req.params.id} - 404: Resource with id: ${resource_id} not found`)
            return res.status(404).json({message: `Resource with id: ${resource_id} not found`});
        }

        const user = validateUser.data
        if (user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`DELETE resources/delete-file/${req.params.id} - '401': Unauthorized access to delete`)
            return res.status(401).json({message: 'Unauthorized access to delete'});
        }

        const file = await repository.get_resource_file_by_id(file_id, resource_id);
        if (!file) {
            helpers.log_request_error(`DELETE resources/delete-file/${req.params.id} - 404: file not found`)
            return res.status(404).json({message: "file not found"});
        }

        const result = await repository.delete_resource_file(file_id)

        res.status(204).json(result)
       
    } catch (error) {
        helpers.log_request_error(`DELETE resources/delete-file/${req.params.id} - 404: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

module.exports = router;