const express = require('express');
const multer = require("multer");
const validator = require("express-validator");
const axios = require('axios');

const Model = require('../db/models');
const repository = require('../db/repository');
const helpers = require('../helpers');
const schemas = require('../schemas/resource-schemas');

const router = express.Router()

const FILE_PATH = "uploads/"
const maxSize = 2000000
const storage = multer.diskStorage({
    destination: FILE_PATH,
    limits: { fileSize: maxSize },
    filename: (req, file, callback) => {
        const date = Date.now()
        callback(null, date.toString() + "-" + file.originalname);
    },
    fileFilter: function (req, file, cb) {
        if (file.mimetype !== 'image/png') {
         req.fileValidationError = 'goes wrong on the mimetype';
         return cb(null, false, new Error('goes wrong on the mimetype'));
        }
        cb(null, true);
       }
  });
const upload = multer({ storage: storage });

const INSTITUTE_BASE_URL = process.env.INSTITUTE_SERVICE

/** 
 * @swagger
 * /resources/new:
 *  post:
 *      summary: Inserts a new resource into the db
 *      description: |
 *          Will only insert if the category in the request matches an existing category in db. 
 *          If sub_categories provided don't exist, an error will be thrown.
 * 
 *          The category and sub_categories are names while the institute is the institute ID where the resource will be published under.
 * 
 *          Requires a bearer token for authentication
 * 
 *          ## Schema
 *          ### topic: {required: true, type: string}
 *          ### description: {required: true, type: string}
 *          ### category: {required: true, type: string} 
 *          ### sub_categories: {required: true, type: [string]}
 *          ### institute: {required: true, type: ObjectID}  
 *          ### resource_type: {required: true, type: string} 
 *          ### citations: {required: false, type: [string]} 
 *          ### date: {type: date, default: date-of-creation} 
 *          ### ratings: {type: [number], min: 1, max: 5}  
 * responses:
 *    '201':
 *      description: Created
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '409':
 *      description: Duplicate
 *    '401':
 *      description: Unauthorized
*/
router.post('/new',  
    upload.single("avatar"),
    validator.checkSchema(schemas.newResourceSchema), 
    async (req, res) => {
        const file = req.file;
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error('POST /resources/new - 400: validation errors')
            return res.status(400).json({ errors: errors.array() });
        }

        // Authorization
        if (!req.headers.authorization) {
            helpers.delete_file(file)
            helpers.log_request_error('POST /resources/new - 401: Token not found')
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.delete_file(file)
            helpers.log_request_error(`POST /resources/new - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const category = await repository.get_category_by_name(req.body.category);
        if (!category) {
            helpers.delete_file(file)
            helpers.log_request_error(`POST /resources/new - 404: Category: ${req.body.category} not found`)
            return res.status(404).json({message: `Category: ${req.body.category} not found`});
        }
        let unknown_cats = await helpers.validateArray(category.sub_categories, req.body.sub_categories);

        if (unknown_cats.length !== 0) {
            helpers.delete_file(file)
            helpers.log_request_error(`POST /resources/new - 404: Unkown sub-categories`)

            return res.status(404).json({
                message: `sub_categories not part of ${category.name}`,
                sub_categories: unknown_cats
            })
        }
        
        const institute_req = await axios({
            method: 'get',
            url: `${INSTITUTE_BASE_URL}/one/${req.body.institute}`,
            headers: {'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`}
        })
        const institute = institute_req.data

        const validateTopic = await helpers.validateTopicName(req.body.topic, req.body.institute,  user._id.toString());
        if (!validateTopic) {
            helpers.delete_file(file)
            helpers.log_request_error(`POST /resources/new - 409: Duplicate resouce`)

            return res.status(409).json(
                {
                    message: `Resource with topic ${req.body.topic}, authored by ${user._id.toString()} already exists under institute ${req.body.institute}`
                }
            )
        }

        let citations = []
        if (req.body.citations){
            const unique_citations = new Set(req.body.citations);
            citations = Array.from(unique_citations)
        }
        const unique_subs = new Set(req.body.sub_categories);
        
       
        let avatar_path = null;

        if (file){ // if a file is sent
            if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")) {
                helpers.log_request_error(`POST resources/new - 400: only .png, .jpg and .jpeg format allowed`)
                helpers.delete_file(file)
                return res.status(400).json({message: "only .png, .jpg and .jpeg format allowed"});
            }
            if (file.size > maxSize) {
                helpers.log_request_error(`POST resources/new - 400: File exceeded 2MB size limit`)
                helpers.delete_file(file)
                return res.status(400).json({message: "File exceeded 2MB size limit"});
            }
            avatar_path = `${FILE_PATH}${file.filename}`
        }

        const data = new Model.resource({
            topic: req.body.topic,
            description: req.body.description,
            author: user._id.toString(),
            avatar: avatar_path,
            category: req.body.category,
            sub_categories: Array.from(unique_subs),
            citations: citations,
            resource_type: req.body.resource_type,
            institute: institute.id
        });
        
        
        const dataToSave = await repository.create_new_resource(data);

        helpers.log_request_info(`POST /resources/new - 201`)
        res.status(201).json(dataToSave);
    } catch (error) {
        console.error(error)
        helpers.delete_file(file)
        helpers.log_request_error(`POST /resources/new - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
    
})

/** 
 * @swagger
 * /resources/one/{id}:
 *  get:
 *      summary: Gets a resource by id
 *      description: | 
 *          Only the author of a resource or the superadmin can access. 
 *          
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to get
 *          - in: query
 *            name: public
 *            schema:
 *              type: boolean
 *            required: false
 *            description: indicator if request came from public
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/one/:id', async (req, res) => {
    try{
        // // Authorization and validation
        // if (!req.headers.authorization) {
        //     helpers.log_request_error(`GET /resources/one/${req.params.id} - 401: Token not found`)
        //     return res.status(401).json({message: "Token not found"});
        // }
        // const validateUser = await helpers.validateUser(req.headers);
        // if (validateUser.status !== 200) {
        //     helpers.log_request_error(`GET /resources/one/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
        //     return res.status(validateUser.status).json({message: validateUser.message});
        // }
        // const user = validateUser.data;

        const resource = await repository.get_resource_data(req.params.id, req.headers);
        if (!resource) {
            helpers.log_request_error(`GET /resources/one/${req.params.id} - 404: Resource not found`)
            return res.status(404).json({message: "Resource not found"});
        }

        // if (resource.visibility != "public"){
        //     if (user._id.toString() != resource.author._id && user.superadmin == false) {
        //         helpers.log_request_error(`GET /resources/one/${req.params.id} - 401: Unauthorized access to get`)
        //         return res.status(401).json({message: 'Unauthorized access to get'});
        //     }
        // }
        const from_public = req.query.public;
        if (from_public) repository.add_view_count(req.params.id)
        helpers.log_request_info(`GET /resources/one/${req.params.id} - 200`)
        res.status(200).json(resource);
    }
    catch(error){
        console.error(error)
        helpers.log_request_error(`GET /resources/one/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/my-resources:
 *  get:
 *      summary: Gets all resources for the user making the request
 *      description: >
 *           Returns the results from newest to oldest by default
 *           Offers options for filtering by institute. If no institute is passed as the query parameter, then all the resources will
 *           be returned.
 * 
 *           Requires a bearer token for authentication
 *      parameters: 
 *          - in: query
 *            name: institute
 *            schema:
 *              type: UUID/Object ID
 *            required: false
 *            description: id of the institute to get
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/my-resources', async (req, res) => {
    try{
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET /resources/my-resources - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET /resources/my-resources - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        let institute_id = req.query.institute;
        let data = []
        if (institute_id){
            data =  await repository.get_user_resources(user._id.toString(), institute_id);
        }
        else {
            data =  await repository.get_user_resources(user._id.toString());
        }

        helpers.log_request_info(`GET /resources/my-resources - 200`)

        res.status(200).json(data);
    }
    catch(error){
        helpers.log_request_error(`GET /resources/my-resources - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/all:
 *  get:
 *      summary: Gets all resources
 *      description: >
 *           Returns the results from newest to oldest by default
 *           Offers options for filtering by categories and sub-categories
 *           If no category is provided, then you can't filter by sub-category
 *           
 *           Only a superadmin can access this data.
 * 
 *           Requires a bearer token for authentication
 *      parameters: 
 *          - in: query
 *            name: category
 *            schema:
 *              type: string
 *            required: false
 *            description: name of the category to get
 *          - in: query  
 *            name: sub
 *            schema:
 *              type: string
 *            required: false
 *            description: name of the sub-category to get. Will fail if category isn't provided
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/all', async (req, res) => {
    try{
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET /resources/all- 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET /resources/all - ${validateUser.status}: ${validateUser.message}`)

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`GET /resources/all - 401: Unauthorized access. Only superadmin can get`)

            return res.status(401).json({message: 'Unauthorized access. Only superadmin can get'});
        }

        let sub = req.query.sub;
        let category = req.query.category;
        let data = null;
        if (category){
            if (sub){
                data = await repository.get_all_resources(category=category, sub_cat=sub)
            }
            else data = await repository.get_all_resources(category=category)
        }
        else data = await repository.get_all_resources()

        helpers.log_request_info(`GET /resources/all - 200`)

        res.status(200).json(data);
    }
    catch(error){
        helpers.log_request_error(`GET /resources/all - 400: ${error.message}`)

        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/public:
 *  get:
 *      summary: Gets all public resources
 *      description: >
 *           Returns the results by rating. Can be sorted by topic (alphabetically), date or view count
 *           Offers options for filtering by categories and sub-categories
 *           If no category is provided, then you can't filter by sub-category
 * 
 *      parameters: 
 *          - in: query
 *            name: category
 *            schema:
 *              type: string
 *            required: false
 *            description: name of the category to get
 *          - in: query  
 *            name: sub
 *            schema:
 *              type: string
 *            required: false
 *            description: name of the sub-category to get. Will fail if category isn't provided
 *          - in: query  
 *            name: type
 *            schema:
 *              type: string
 *            required: false
 *            description: filter results by result type
 *          - in: query  
 *            name: sort
 *            schema:
 *              type: string
 *            required: false
 *            description: >
 *               sort the results with one of the following keys: topic, rating, date, view_count
 *          - in: query  
 *            name: reverse
 *            schema:
 *              type: boolean
 *            required: false
 *            description: true or false. Reverses the order of the sort operation e.g. reverse alphabetical, latest first etc.
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/public', async (req, res) => {
    try {
        let user_id = null
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status === 200) {
            const user = validateUser.data;
            user_id = user._id
        }

        let sub = req.query.sub;
        let category = req.query.category;
        let type = req.query.type
        let sort_key = req.query.sort || 'rating';
        let reverse = req.query.reverse || 'false'
        let sort_order = 1;
        if (reverse == 'true'){
            sort_order = -1;
        }
        let data = null;
        if (type) {
            data = await repository.get_public_resources(category='None', sub_cat='None', type=type, user=user_id, sort_key=sort_key, sort_value=sort_order)
            return res.status(200).json(data);
        }

        if (category){
            if (sub){
                data = await repository.get_public_resources(category=category, sub_cat=sub, type='', user=user_id, sort_key=sort_key, sort_value=sort_order)
            }
            else data = await repository.get_public_resources(category=category, sub_cat='None', type='', user=user_id, sort_key=sort_key, sort_value=sort_order)
        }
        else data = await repository.get_public_resources("None", "None", '', user_id, sort_key=sort_key, sort_value=sort_order)

        helpers.log_request_info(`GET /resources/public - 200`)

        res.status(200).json(data);
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`GET /resources/public - 400: ${error.message}`)

        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/request-institute-publish/{id}:
 *  post:
 *      summary: Makes a request to an institute admin to pubish a resource
 *      description: |
 *          Only the author can make this request
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to issue a publish request for
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
router.post('/request-institute-publish/:id', async (req, res) => {
    try {
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST /resources/request-institute-publish/${req.params.id} - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(
                `POST /resources/request-institute-publish/${req.params.id} - ${validateUser.status}: ${validateUser.message}`
            )

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`POST /resources/request-institute-publish/${req.params.id} - 404: Resource not found`)
            return res.status(404).json({message: "Resource not found"});
        }

        if (user._id.toString() != resource.author) {
            helpers.log_request_error(
                `POST /resources/request-institute-publish/${req.params.id} - 401: nauthorized access. Only the author can request a publish`
            )

            return res.status(401).json({message: 'Unauthorized access. Only the author can request a publish'});
        }

        const publish_res = await axios({
            method: 'post',
            url: `${INSTITUTE_BASE_URL}/institute-publish-request/${resource.institute.toString()}/${resource._id.toString()}`,
            headers: {'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`}
        })

        helpers.log_request_info(`POST /resources/request-institute-publish/${req.params.id} - 200`)

        res.status(200).json(publish_res.data);
    } catch (error) {
        if (error.response) error.message = error.response.data.message;
        helpers.log_request_error(`POST /resources/request-institute-publish/${req.params.id} - 400: ${error.message}`)

        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/monthly-stats:
 *  get:
 *      summary: Gets the monthly statistics for resources added
 *      description: >
 *           Returns the number of resources created by month and year
 *           
 *           Only a superadmin can request for stats.
 * 
 *           Requires a bearer token for authentication
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/monthly-stats', async (req, res) => {
    try {
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET /resources/monthly-stats - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(
                `GET /resources/monthly-stats  - ${validateUser.status}: ${validateUser.message}`
            )

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`GET /resources/monthly-stats - 401: Unauthorized access. Only superadmin can get`)

            return res.status(401).json({message: 'Unauthorized access. Only superadmin can get'});
        }
        
        const result = await repository.get_monthly_stats();

        helpers.log_request_info(`GET /resources/monthly-stats - 200`)

        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET /resources/monthly-stats - 400: ${error.message}`)

        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/group-stats:
 *  get:
 *      summary: Returns the total number of resources categorized by resource type (Private, Government, Education)
 *      description: >
 *           
 *           Only a superadmin can request for stats.
 * 
 *           Requires a bearer token for authentication
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.get('/group-stats', async (req, res) => {
    try {
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET /resources/group-stats - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET /resources/group-stats - ${validateUser.status}: ${validateUser.message}`)

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`GET /resources/group-stats - 401: Unauthorized access. Only superadmin can get`)

            return res.status(401).json({message: 'Unauthorized access. Only superadmin can get'});
        }
        
        const result = await repository.get_group_stats();

        helpers.log_request_info(`GET /resources/group-stats - 200`)

        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET /resources/group-stats - 400: ${error.message}`)

        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /resources/update/{id}:
 *  patch:
 *      summary: updates a given resource
 *      description: |
 *          Multiple fields can be updated in one go. Not recommended for add/remove operations
 *          Only the superadmin or author can update
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to update
 * responses:
 *    '200':
 *      description: updated
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '409':
 *      description: Duplicate
*/
router.patch('/update/:id',
    async (req, res) => {
        try {
            // Authorization and validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH /resources/update/${req.params.id} - 401: Token not found`)

                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`PATCH /resources/update/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

                return res.status(validateUser.status).json({message: validateUser.message});
            }
            const user = validateUser.data;

            const resource = await repository.get_resource_by_id(req.params.id);
            if (!resource) {
                helpers.log_request_error(`PATCH /resources/update/${req.params.id} - 404: Resource not found`)

                return res.status(404).json({message: "Resource not found"});
            }

            if (user._id.toString() != resource.author && user.superadmin == false) {
                helpers.log_request_error(`PATCH /resources/update/${req.params.id} - 401: Unauthorized access to edit`)

                return res.status(401).json({message: 'Unauthorized access to edit'});
            }

            const validateTopic = await helpers.validateTopicName(req.body.topic, resource.institute.toString());
            if (!validateTopic) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 409: Topic exists`)

                return res.status(409).json({message: `Resource with topic ${req.body.topic} already exists under institute ${resource.institute.toString()}`})
            }
            const result = await repository.update_resource_fields(id, req.body)

            helpers.log_request_info(`PATCH /resources/update/${req.params.id} - 200`)

            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`PATCH /resources/update/${req.params.id} - 400: ${error.message}`)

            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /resources/edit-topic/{id}:
 *  patch:
 *      summary: updates a given resource topic
 *      description: |
 *          Only the superadmin or author can edit
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource for which the topic is to be updated
 * responses:
 *    '200':
 *      description: updated
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '409':
 *      description: Duplicate
*/
router.patch('/edit-topic/:id',
    validator.check("topic").notEmpty().withMessage("topic must be a non-empty string"),
    async (req, res) => {
        try {
            //input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 400: validation errors`)

                return res.status(400).json({ errors: errors.array() });
            }

            // Authorization and validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 401: Token not found`)

                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

                return res.status(validateUser.status).json({message: validateUser.message});
            }
            const user = validateUser.data;

            const resource = await repository.get_resource_by_id(req.params.id);
            if (!resource) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 404: Resource not found`)

                return res.status(404).json({message: "Resource not found"});
            }

            if (user._id.toString() != resource.author && user.superadmin == false) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 401: Unauthorized access to edit`)

                return res.status(401).json({message: 'Unauthorized access to edit'});
            }

            const validateTopic = await helpers.validateTopicName(req.body.topic, resource.institute.toString());
            if (!validateTopic) {
                helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 409: Topic exists`)

                return res.status(409).json({message: `Resource with topic ${req.body.topic} already exists under institute ${resource.institute.toString()}`})
            }
            const result = await repository.update_resource_topic(req.params.id, req.body.topic);

            helpers.log_request_info(`PATCH /resources/edit-topic/${req.params.id} - 200`)

            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`PATCH /resources/edit-topic/${req.params.id} - 400: ${error.message}`)

            res.status(400).json({message: error.message});
        }
})


/** 
 * @swagger
 * /resources/edit-description/{id}:
 *  patch:
 *      summary: updates a given resource description
 *      description: |
 *          Only the superadmin or author can edit
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource for which the description is to be updated
 * responses:
 *    '200':
 *      description: updated
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/edit-description/:id',
    validator.check("description").notEmpty().withMessage("description must be a non-empty string"),
    async (req, res) => {
        try {
            //input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`PATCH /resources/edit-description/${req.params.id} - 400: validation errors`)

                return res.status(400).json({ errors: errors.array() });
            }

            // Authorization and validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH /resources/edit-description/${req.params.id} - 401: Token not found`)

                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`PATCH /resources/edit-description/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

                return res.status(validateUser.status).json({message: validateUser.message});
            }
            const user = validateUser.data;

            const resource = await repository.get_resource_by_id(req.params.id);
            if (!resource) {
                helpers.log_request_error(`PATCH /resources/edit-description/${req.params.id} - 404: Resource not found`)

                return res.status(404).json({message: "Resource not found"});
            }

            if (user._id.toString() != resource.author && user.superadmin == false) {
                helpers.log_request_error(`PATCH /resources/edit-description/${req.params.id} - 401: Unauthorized access to edit`)

                return res.status(401).json({message: 'Unauthorized access to edit'});
            }

            const result = await repository.update_resource_description(req.params.id, req.body.description);

            helpers.log_request_info(`PATCH /resources/edit-description/${req.params.id} - 200`)

            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`PATCH /resources/edit-description/${req.params.id} - 400: ${error.message}`)

            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /resources/edit-category/{id}:
 *  patch:
 *      summary: updates a given resource category
 *      description: |
 *          Returns an authorization error if the user making the request is not the author or the superadmin.
 *          The new category must exist in the database.
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the resource for which the category is to be updated
 * responses:
 *    '200':
 *      description: updated
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/edit-category/:id',
    validator.check("category").notEmpty().withMessage("category must be a non-empty string"),
    async (req, res) => {
        try {
            //input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`PATCH /resources/edit-category/${req.params.id} - 401: validation errors`)

                return res.status(400).json({ errors: errors.array() });
            }

            // Authorization and validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH /resources/edit-category/${req.params.id} - 401: Token not found`)

                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(
                    `PATCH /resources/edit-category/${req.params.id} - ${validateUser.status}: ${validateUser.message}`
                )

                return res.status(validateUser.status).json({message: validateUser.message});
            }
            const user = validateUser.data;

            const resource = await repository.get_resource_by_id(req.params.id);
            if (!resource) {
                helpers.log_request_error(`PATCH /resources/edit-category/${req.params.id} - 404: Resource not found`)

                return res.status(404).json({message: "Resource not found"});
            }

            if (user._id.toString() != resource.author && user.superadmin == false) {
                helpers.log_request_error(`PATCH /resources/edit-category/${req.params.id} - 401: Unauthorized access to edit`)

                return res.status(401).json({message: 'Unauthorized access to edit'});
            }

            const category = await repository.get_category_by_name(req.body.category);
            if (!category) return res.status(404).json({message: `Category: ${req.body.category} not found`});

            const result = await repository.update_resource_category(req.params.id, req.body.category);

            helpers.log_request_info(`PATCH /resources/edit-category/${req.params.id} - 200`)
            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`PATCH /resources/edit-category/${req.params.id} - 400: ${error.message}`)

            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /resources/edit-visibility/{id}:
 *  patch:
 *      summary: updates a given resource's visibility
 *      description: |
 *          Only a superuser can edit a resource's visibility.
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to for which the visibility is to be updated
 * responses:
 *    '200':
 *      description: updated
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/edit-visibility/:id',
    validator.check("visibility").custom(value => {
        if (value != "private" && value != "public") throw new Error("visibility must be private or public");
        return true;
        }),
    async (req, res) => {
        try {
            //input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`PATCH /resources/visibility/${req.params.id} - 400: validation errors`)

                return res.status(400).json({ errors: errors.array() });
            }

            // Authorization and validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH /resources/visibility/${req.params.id} - 401: Token not found`)

                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`PATCH /resources/visibility/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

                return res.status(validateUser.status).json({message: validateUser.message});
            }
            const user = validateUser.data;

            const resource = await repository.get_resource_by_id(req.params.id);
            if (!resource) {
                helpers.log_request_error(`PATCH /resources/visibility/${req.params.id} - 404: Resource not found`)

                return res.status(404).json({message: "Resource not found"});
            }

            if (!user.superadmin) {
                helpers.log_request_error(`PATCH /resources/visibility/${req.params.id} - 401: Unauthorized access to edit`)

                return res.status(401).json({message: 'Unauthorized access to edit'});
            }

            const result = await repository.update_visibility(req.params.id, req.body.visibility);

            helpers.log_request_info(`PATCH /resources/visibility/${req.params.id} - 200`)
            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`PATCH /resources/visibility/${req.params.id} - 400: ${error.message}`)

            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /resources/edit-resource-type/{id}:
 *  patch:
 *      summary: updates a given resource's type
 *      description: |
 *          Only the superadmin or author can edit
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource for which the type is to be updated
 * responses:
 *    '200':
 *      description: updated
 *    '404':
 *      description: resource not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/edit-resource-type/:id',
    validator.check("resource_type").custom(value => {
        if (value !== "government" && value !== "private" && value !== "education"){
            throw new Error("resource_type must be government, private or education");
        } 
        return true;
        }),
    
    async (req, res) => {
        try {
            //input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`PATCH /resources/edit-resource-type/${req.params.id} - 400: validation errors`)

                return res.status(400).json({ errors: errors.array() });
            }

            // Authorization and validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH /resources/edit-resource-type/${req.params.id} - 401: Token not found`)

                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`PATCH /resources/edit-resource-type/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

                return res.status(validateUser.status).json({message: validateUser.message});
            }
            const user = validateUser.data;

            const resource = await repository.get_resource_by_id(req.params.id);
            if (!resource) {
                helpers.log_request_error(`PATCH /resources/edit-resource-type/${req.params.id} - 404: Resource not found`)

                return res.status(404).json({message: "Resource not found"});
            }

            if (user._id.toString() != resource.author && user.superadmin == false) {
                helpers.log_request_error(`PATCH /resources/edit-resource-type/${req.params.id} - 401: Unauthorized access to edit`)

                return res.status(401).json({message: 'Unauthorized access to edit'});
            }

            const result = await repository.update_resource_type(req.params.id, req.body.resource_type);

            helpers.log_request_info(`PATCH /resources/edit-resource-type/${req.params.id} - 200`)
            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`PATCH /resources/edit-resource-type/${req.params.id} - 400: ${error.message}`)

            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /resources/add-subcategories/{id}:
 *  patch:
 *      summary: Adds sub-categories to a given resource.
 *      description: |
 *          Throws an error if the sub-categories provided don't exist under the resource category
 * 
 *          Only the superadmin or author can add
 * 
 *          Requires a bearer token for authentication
 *          ## Schema
 *          ### sub_categories: {required: true, type: [String]} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to add sub-categories to
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/add-sub-categories/:id', 
    validator.check('sub_categories').custom(value => {
    if (!(Array.isArray(value) && value.length > 0)) throw new Error("sub_categories field must be a non-empty array");
    return true;
    }), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 400: validation errors`)

            return res.status(400).json({ errors: errors.array() });
        }
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 404: Resource not found`)

            return res.status(404).json({message: "Resource not found"});
        }

        if (user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 401: Unauthorized access to edit`)

            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const category = await repository.get_category_by_name(resource.category);
        if (!category) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 404: Category: ${req.body.category} not found`)

            return res.status(404).json({message: `Category: ${req.body.category} not found`});
        }

        let unknown_cats = await helpers.validateArray(category.sub_categories, req.body.sub_categories);

        if (unknown_cats.length !== 0) {
            helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 404: unknown sub-categories`)

            return res.status(404).json({
                message: `sub_categories not part of ${category.name}`,
                sub_categories: unknown_cats
            })
        }
       
        const result = await repository.add_resource_sub_categories(req.params.id, req.body.sub_categories);

        helpers.log_request_info(`PATCH /resources/add-sub-categories/${req.params.id} - 201`)

        res.status(201).json(result);
    }
    catch (error) {
        helpers.log_request_error(`PATCH /resources/add-sub-categories/${req.params.id} - 400: ${error.message}`)

        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /resources/{id}/remove-subcategories:
 *  patch:
 *      summary: Removes sub-categories from a given resource.
 *      description: |
 *          Throws an error if the sub-categories provided don't exist under the resource category
 * 
 *          Only the superadmin or author can remove
 * 
 *          Requires a bearer token for authentication
 *          ## Schema
 *          ### sub_categories: {required: true, type: [String]} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to remove sub-categories from
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/remove-sub-categories/:id', 
    validator.check('sub_categories').custom(value => {
    if (!(Array.isArray(value) && value.length > 0)) throw new Error("sub_categories field must be a non-empty array");
    return true;
    }), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 400: validation errors`)

            return res.status(400).json({ errors: errors.array() });
        }
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 404: Resource not found`)

            return res.status(404).json({message: "Resource not found"});
        }

        if (user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 401: Unauthorized access to edit`)

            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const category = await repository.get_category_by_name(resource.category);
        if (!category) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 404: Category: ${req.body.category} not found`)


            return res.status(404).json({message: `Category: ${req.body.category} not found`});
        }

        let unknown_cats = await helpers.validateArray(category.sub_categories, req.body.sub_categories);

        if (unknown_cats.length !== 0) {
            helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 404: unknown sub-categories`)

            return res.status(404).json({
                message: `sub_categories not part of ${category.name}`,
                sub_categories: unknown_cats
            })
        }
       
        const result = await repository.remove_resource_sub_categories(req.params.id, req.body.sub_categories);

        helpers.log_request_info(`PATCH /resources/remove-sub-categories/${req.params.id} - 201`)
        res.status(201).json(result);
    }
    catch (error) {
        helpers.log_request_error(`PATCH /resources/remove-sub-categories/${req.params.id} - 400: ${error.message}`)

        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /resources/add-citations/{id}:
 *  patch:
 *      summary: Adds citations to a given resource.
 *      description: |
 *          Only the superadmin or author can add
 * 
 *          Requires a bearer token for authentication
 *          ## Schema
 *          ### citations: {required: true, type: [String]} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to add citations to
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/add-citations/:id', 
    validator.check('citations').custom(value => {
    if (!(Array.isArray(value) && value.length > 0)) throw new Error("citations field must be a non-empty array");
    return true;
    }), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH /resources/add-citations/${req.params.id} - 400: validation errors`)

            return res.status(400).json({ errors: errors.array() });
        }
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH /resources/add-citations/${req.params.id} - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH /resources/add-citations/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`PATCH /resources/add-citations/${req.params.id} - 404: Resource not found`)

            return res.status(404).json({message: "Resource not found"});}


        if (user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`PATCH /resources/add-citations/${req.params.id} - 401: Unauthorized access to edit`)

            return res.status(401).json({message: 'Unauthorized access to edit'});
        }
       
        const result = await repository.add_resource_citations(req.params.id, req.body.citations);

        helpers.log_request_info(`PATCH /resources/add-citations/${req.params.id} - 200`)

        res.status(201).json(result);
    }
    catch (error) {
        helpers.log_request_error(`PATCH /resources/add-citations/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /resources/remove-citations/{id}:
 *  patch:
 *      summary: Removes citations from a given resource.
 *      description: |
 *          Only the superadmin or author can remove
 * 
 *          Requires a bearer token for authentication
 * 
 *          ## Schema
 *          ### citations: {required: true, type: [String]} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to remove citations from
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/remove-citations/:id', 
    validator.check('citations').custom(value => {
    if (!(Array.isArray(value) && value.length > 0)) throw new Error("citations field must be a non-empty array");
    return true;
    }), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH /resources/remove-citations/${req.params.id} - 400: validation errors`)

            return res.status(400).json({ errors: errors.array() });
        }
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH /resources/remove-citations/${req.params.id} - 401: Token not found`)

            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH /resources/remove-citations/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)

            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`PATCH /resources/remove-citations/${req.params.id} - 404: Resource not found`)

            return res.status(404).json({message: "Resource not found"});
        }

        if (user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`PATCH /resources/remove-citations/${req.params.id} - 401: Unauthorized access to edit`)

            return res.status(401).json({message: 'Unauthorized access to edit'});
        }
       
        const result = await repository.remove_resource_citations(req.params.id, req.body.citations);

        helpers.log_request_info(`PATCH /resources/remove-citations/${req.params.id} - 200`)
        res.status(201).json(result);
    }
    catch (error) {
        helpers.log_request_error(`PATCH /resources/remove-citations/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /resources/delete/{id}:
 *  delete:
 *      summary: Delete resource
 *      description: |
 *          Deletes a resource given an id. Only the superadmin or author can delete
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the resource to delete
 *  responses:
 *    '204':
 *      description: deleted
 *    '404':
 *      description: resource/category not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.delete('/delete/:id', async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`DELETE /resources/delete/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        // Authorization and validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`DELETE /resources/delete/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`DELETE /resources/delete/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const resource = await repository.get_resource_by_id(req.params.id);
        if (!resource) {
            helpers.log_request_error(`DELETE /resources/delete/${req.params.id} - 404: Resource not found`)
            return res.status(404).json({message: "Resource not found"});
        }

        if (user._id.toString() != resource.author && user.superadmin == false) {
            helpers.log_request_error(`DELETE /resources/delete/${req.params.id} - 401: Unauthorized access to delete`)
            return res.status(401).json({message: 'Unauthorized access to delete'});
        }
        
        await axios({
            method: 'patch',
            url:  `${INSTITUTE_BASE_URL}/remove-resources/${resource.institute}`,
            data: {
                'resources': [req.params.id]
            },
            headers: {'Authorization': `Bearer ${req.headers.authorization.split(' ')[1]}`}
        })
        
        const data = await repository.delete_resource_by_id(req);

        helpers.log_request_info(`DELETE /resources/delete/${req.params.id} - 204`)
        res.status(204).json({message: `Document with topic name: ${data.topic} has been deleted..`});
    }
    catch (error) {
        helpers.log_request_error(`DELETE /resources/delete/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({ message: error.message })
    }
})


module.exports = router;