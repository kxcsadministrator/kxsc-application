const express = require('express');
const multer = require("multer");
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const validator = require('express-validator');
const jwt = require("jsonwebtoken");
const repository = require('../db/repository');
const helpers = require('../helpers');

const router = express.Router()
const SECRET_KEY = process.env.SECRET_KEY || 'this-is-just for tests'

const FILE_PATH = "files/uploads/"
const maxSize = 2000000
// const storage = multer.diskStorage({
//     destination: FILE_PATH,
//     limits: { fileSize: maxSize },
//     filename: (req, file, callback) => {
//         const date = Date.now()
//         callback(null, date.toString() + "-" + file.originalname);
//     }
// });
aws.config.update({
    secretAccessKey: process.env.AWS_SECRET,
    accessKeyId: process.env.AWS_ACCESS_KEY,
    region: 'eu-north-1'
});

const s3 = new aws.S3();

const aws_storage = multerS3({
    s3: s3,
    acl: 'public-read',
    bucket: 'kxcs-files-bucket',
    key: function (req, file, cb) {
        // console.log(file);
        const date = Date.now()
        cb(null, date.toString() + "-" + file.originalname);
        // cb(null, file.originalname); //use Date.now() for unique file keys
    }
})
const upload = multer({ 
    storage: aws_storage
});

/** 
 * @swagger
 * /blog/new:
 *  post:
 *      summary: Creates a new blog article
 *      description: |
 *          A title and body must be provided. Requires a bearer token for authentication
 * 
 *          ## Schema
 *          ### title: {required: true, type: String}
 *          ### body: {required: true, type: String}
 * responses:
 *    '201':
 *      description: Created
 *    '409':
 *      description: Duplicate
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post("/new", 
    upload.single("avatar"),
    validator.check("title").isLength({min: 3}).withMessage("Article title must be more than 3 characters"), 
    validator.check("body").isLength({min: 3}).withMessage("Article body must be more than 3 characters"),
    async (req, res) => {
        const file = req.file; // outside to be accessible to catch bloack
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST pages/new - 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }
        const title = req.body.title
        const body = req.body.body
        

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST blog/new - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST blog/new - 401: Unauthorized access to create`)
            return res.status(401).json({message: 'Unauthorized access to create'});
        }

        const dup_article = await repository.get_article_by_title(title)
        if (dup_article){
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST blog/new - 409: article ${title} already exists`)
            return res.status(409).json({message: `article ${title} already exists`});
        }

        let avatar_path = null;

        if (file){ // if a file is sent
            if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")) {
                helpers.log_request_error(`POST resources/new - 400: only .png, .jpg and .jpeg format allowed`)
                helpers.delete_s3_file(s3, file.key)
                return res.status(400).json({message: "only .png, .jpg and .jpeg format allowed"});
            }
            if (file.size > maxSize) {
                helpers.log_request_error(`POST resources/new - 400: File exceeded 2MB size limit`)
                helpers.delete_s3_file(s3, file.key)
                return res.status(400).json({message: "File exceeded 2MB size limit"});
            }
            avatar_path = file.location
        }

        const result = await repository.create_new_article(title, body, auth_user._id, avatar_path)
        helpers.log_request_info("POST blog/new - 200")
        res.status(201).json(result);
    } catch (error) {
        console.log(error)
        helpers.delete_s3_file(s3, file.key)
        helpers.log_request_error(`POST blog/new  - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /blog/one/{article_id}:
 * get:
 *   summary: Retrieves a given article by the id
 *   parameters: 
 *          - in: path
 *            name: article_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the article to retrieve
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get("/one/:article_id", 
    async (req, res) => {
    try {
        const article_id = req.params.article_id

        const article = await repository.get_article_by_id(article_id)
        if (!article){
            helpers.log_request_error(`GET blog/one/${article_id} - 404: article ${article_id} not found`)
            return res.status(404).json({message: `article ${article_id} not found`});
        }

        helpers.log_request_info(`GET blog/one/${article_id} - 200`)
        res.status(200).json(article);
    } catch (error) {
        helpers.log_request_error(`GET blog/one/${req.params.article_id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /blog/all:
 * get:
 *   summary: Retrieves all blog articles
 *   parameters: 
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
 *            description: the number of items to retrieve. Defaults to 20 if not specified.
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get("/all", 
    async (req, res) => {
    try {
        const page = req.query.page || 1
        const limit = req.query.limit || 20

        const articles = await repository.get_all_articles(page, limit)
        helpers.log_request_info(`GET blog/all - 200`)
        res.status(200).json(articles);
    } catch (error) {
        helpers.log_request_error(`GET blog/all - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /blog/edit/{article_id}:
 *  patch:
 *      summary: Edits an article
 *      parameters: 
 *          - in: path
 *            name: article_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: ID of the article to edit
 * responses:
 *    '201':
 *      description: Updated
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch("/edit/:article_id", 
    async (req, res) => {
    try {
        const article_id = req.params.article_id
        const new_title = req.body.title
        const new_body = req.body.body

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH blog/edit/${req.params.article_id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`PATCH blog/edit/${req.params.article_id} - 401: Unauthorized access to edit`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const article = await repository.get_article_by_id(article_id)
        if (!article){
            helpers.log_request_error(`GET blog/one/${article_id} - 404: article ${article_id} not found`)
            return res.status(404).json({message: `article ${article_id} not found`});
        }

        const dup_article = await repository.get_article_by_title(new_title)
        if (dup_article){
            helpers.log_request_error(`PATCH blog/edit/${req.params.article_id} - 409: article ${new_title} already exists`)
            return res.status(409).json({message: `article ${new_title} already exists`});
        }

        obj = {title: new_title, body: new_body}
        const result = await repository.update_article(article_id, obj, article.title, article.body)
        helpers.log_request_info(`PATCH blog/edit/${req.params.article_id} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH blog/edit/${req.params.article_id}  - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /blog/delete/{article_id}:
 *  delete:
 *      summary: Deletes an article
 *      description: |
 *         Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: article_id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: ID of the article to delete
 * responses:
 *    '204':
 *      description: Deleted
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.delete("/delete/:article_id", 
    async (req, res) => {
    try {
        const article_id = req.params.article_id

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`DELETE blog/delete/${req.params.article_id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`DELETE blog/delete/${req.params.article_id} - 401: Unauthorized access to delete`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const is_article = await repository.get_article_by_id(article_id)
        if (!is_article){
            helpers.log_request_error(`DELETE blog/delete/${req.params.article_id} - 404: Article ${article_id} not found`)
            return res.status(401).json({message: `Article ${article_id} not found`});
        }
        if (is_article.avatar){
            let name_array = is_article.avatar.split("/")
            let fname = name_array[name_array.length - 1];
            helpers.delete_s3_file(s3, fname.replace(/%20/g, " "))
        }
        const result = await repository.delete_article(article_id)
        helpers.log_request_info(`DELETE blog/delete/${req.params.article_id} - 200`)
        res.status(204).json(result);
    } catch (error) {
        helpers.log_request_error(`DELETE blog/delete/${req.params.article_id}  - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /blog/update-avatar/{id}:
 *  post:
 *      summary: Changes the avatar for a given blog article
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
    const file = req.file;
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST blog/update-avatar/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const article_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!article_id) {
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST blog/update-avatar/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No resource provided"})
        }
        if (!file) {
            helpers.log_request_error(`POST blog/update-avatar/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No file selected"})
        }

        if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")){
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST blog/update-avatar/${req.params.id} - 400: only .png, .jpg and .jpeg format allowed`)
            return res.status(400).json({message: "only .png, .jpg and .jpeg format allowed"});
        }

        if (file.size > 2000000) {
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST blog/update-avatar/${id} - 400: File exceeded 2MB size limit`)
            return res.status(400).json({message: "File exceeded 2MB size limit"});
        }
        
        // if both resources and files were provided
        const article = await repository.get_article_by_id(article_id)
        if (!article) {
            helpers.delete_s3_file(s3, file.key)
            helpers.log_request_error(`POST resources/update-avatar/${req.params.id} - '404': Resource with id: ${article_id} not found`)
            return res.status(404).json({message: `Resource with id: ${article_id} not found`})
        }

        const avatar_path = file.location
        const result = await repository.update_blog_avatar(article_id, avatar_path);
        
        if (article.avatar){
            let name_array = article.avatar.split("/")
            let fname = name_array[name_array.length - 1];
            helpers.delete_s3_file(s3, fname.replace(/%20/g, " "))
        }

        // helpers.delete_file(article.avatar)
        helpers.log_request_info(`POST blog/update-avatar/${req.params.id} - 200`)
        res.status(200).json(result); 
        
    } 
    catch (error) {
        helpers.delete_s3_file(s3, file.key)
        helpers.log_request_error(`POST blog/update-avatar/${req.params.id} - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }
});

/** 
 * @swagger
 * /blog/remove-avatar/{id}:
 *  post:
 *      summary: Removes the avatar for a given article
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
            helpers.log_request_error(`POST blog/remove-avatar/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        // const file = req.file;
        const article_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!article_id) {
            helpers.log_request_error(`POST blog/remove-avatar/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No resource provided"})
        }
       
        // if both resources and files were provided
        const article = await repository.get_article_by_id(article_id)
        if (!article) {
            helpers.log_request_error(`POST blog/remove-avatar/${req.params.id} - '404': Resource with id: ${article_id} not found`)
            return res.status(404).json({message: `Article with id: ${article_id} not found`})
        }
        const result = await repository.remove_blog_avatar(article_id);
        if (article.avatar){
            let name_array = article.avatar.split("/")
            let fname = name_array[name_array.length - 1];
            helpers.delete_s3_file(s3, fname.replace(/%20/g, " "))
        }
        
        // helpers.delete_file(article.avatar)

        helpers.log_request_info(`POST blog/remove-avatar/${req.params.id} - 200`)
        res.status(200).json(result); 
    } 
    catch (error) {
        console.log(error)
        helpers.log_request_error(`POST blog/remove-avatar/${req.params.id} - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }
});

module.exports = router;
