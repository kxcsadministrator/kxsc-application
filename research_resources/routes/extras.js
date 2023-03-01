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
router.post('/rate',  
    validator.checkSchema(schemas.newRatingSchema),
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Authorization and validation
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.body.id);
        if (!resource) res.status(404).json({message: "Resource not found"}); 

        const hasRated = await repository.validateRate(user._id.toString(), resource._id);
        if (hasRated) return res.status(409).json({message: `User ${user._id} has already rated resource ${resource._id.toString()}`});

        const data = await repository.rate_resource(req.body.id, user._id.toString(), req.body.value);
        res.status(200).json(data);
    }
    catch (error) {
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
 *            required: false
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
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const user = validateUser.data
        if (user._id.toString() == resource.author && user.superadmin == false) return res.status(404).json({message: "Resource not found"});

        return res.status(200).json(data);
    }
    catch(error){
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
        if (!req.query.query) return res.status(400).json({message: "query must be a non-empty string"});
        const data = await repository.search_resource(req.query.query)
        res.status(200).json(data)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
})
/** 
 * @swagger
 * /similar:
 *  get:
 *      summary: Performs similar document retrieval using BM25 for a given query
 *      description: > 
 *          Returns the top 10 most similar results in the order of most similar to least similar
 *          Uses the description of the resources as corpus for the algorithm
 *          
 *      parameters: 
 *          - in: query
 *            name: query
 *            schema:
 *              type: string
 *            required: true
 *            description: The query you wish to perform similar document retrieval on
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/similar', async (req, res) => {
    try {
        if (!req.query.query) return res.status(400).json({message: "query must be a non-empty string"});
        const query = req.query.query
        const result = await repository.similarity(query);
        res.status(200).json(result)
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
})

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
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});
        const user = validateUser.data;

        const files = req.files;
        const resource_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!resource_id) return res.status(400).json({message: "No resource provided"})
        if (!files) return res.status(400).json({message: "No file selected"})
        
        // if both resources and files were provided
        const resource_data = await repository.get_resource_by_id(resource_id)
        if (!resource_data) return res.status(404).json({message: `Resource with id: ${resource_id} not found`})
        
        if (user._id.toString() != resource_data.author && user.superadmin == false) return res.status(401).json({message: 'Unauthorized access to edit'});

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

        res.status(200).json(result); 
        
    } 
    catch (error) {
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /resources/download-files:
 *  get:
 *      summary: Downloads a file from the server.
 *      description: |
 *        The request should have a query parameter 'name'.
 *        This param should match the 'name' of a file object and not original_filename
 * 
 *        You have to be logged in to download files
 * 
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
router.get("/download-file/:id", async (req, res) => {
    const resource_id = req.params.id;
    const file_name = req.query.name;
    try {
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const resource = await repository.get_resource_by_id(resource_id);
        if (!resource) return res.status(400).json({message: `Resource with id: ${resource_id} not found`});
        if (!file_name) return res.status(400).json({message: "no filename provided"});

        if (resource.visibility != "public") return res.status(401).json({message: "Only public resources can be downloaded"});
        
        for (const i in resource.files){
            let file_obj = resource.files[i];
            if (file_obj.name === file_name) return res.download(file_obj.path, file_obj.original_name);
        }
        res.status(404).json({message: `File ${file_name} not found`});
    } catch (error) {
        res.status(400).json({message: error.message});
    }
});

module.exports = router;