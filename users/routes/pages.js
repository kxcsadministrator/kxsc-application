const express = require('express');
const multer = require("multer");
const validator = require('express-validator');
const jwt = require("jsonwebtoken");

const Model = require('../db/models');
const repository = require('../db/repository');
const helpers = require('../helpers');

const router = express.Router()
const SECRET_KEY = process.env.SECRET_KEY || 'this-is-just for tests'

const FILE_PATH = "files/uploads/"
const maxSize = 2000000
const storage = multer.diskStorage({
    destination: FILE_PATH,
    limits: { fileSize: maxSize },
    filename: (req, file, callback) => {
        const date = Date.now()
        callback(null, date.toString() + "-" + file.originalname);
    }
});

const upload = multer({ 
    storage: storage
});

/** 
 * @swagger
 * /pages/new-section:
 *  post:
 *      summary: Creates a new footer section
 *      description: |
 *          A section name must be provided. A section name must be provided. Requires a bearer token for authentication
 * 
 *          ## Schema
 *          ### name: {required: true, type: String}
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
router.post("/new-section", 
    validator.check("name").isLength({min: 3}).withMessage("Section name must be at least three characters"), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST pages/new-section - 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }
        const name = req.body.name

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`POST pages/new-section - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`POST pages/new-section - 401: Unauthorized access to create`)
            return res.status(401).json({message: 'Unauthorized access to create'});
        }

        const dup_section = await repository.get_section(name)
        if (dup_section){
            helpers.log_request_error(`POST pages/new-section - 409: section ${name} already exists`)
            return res.status(409).json({message: `section ${name} already exists`});
        }

        const result = await repository.create_new_footer_section(name)
        helpers.log_request_info("POST pages/new-section - 200")
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`POST pages/new-section  - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/section/{section_name}:
 * get:
 *   summary: Retrieves a given section by the section name
 *   parameters: 
 *          - in: path
 *            name: section_name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to retrive the page from
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get("/section/:section", 
    async (req, res) => {
    try {
        const section_name = req.params.section

        const section = await repository.get_section(section_name)
        if (!section){
            helpers.log_request_error(`GET pages/section/${req.params.section} - 404: section ${req.params.section} not found`)
            return res.status(404).json({message: `page ${req.params.section} not found`});
        }

        helpers.log_request_info(`GET pages/section/${req.params.section} - 200`)
        res.status(200).json(section);
    } catch (error) {
        helpers.log_request_error(`GET pages/section/${req.params.section} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/all-sections:
 * get:
 *   summary: Retrieves all sections
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get("/all-sections", 
    async (req, res) => {
    try {
        const sections = await repository.get_all_sections()
        helpers.log_request_info(`GET pages/section/${req.params.section} - 200`)
        res.status(200).json(sections);
    } catch (error) {
        helpers.log_request_error(`GET pages/section/${req.params.section} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/edit-section/{name}:
 *  patch:
 *      summary: Edits a section name
 *      description: |
 *          A section name must be provided. Requires a bearer token for authentication
 * 
 *          ## Schema
 *          ### new_name: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to edit
 * responses:
 *    '201':
 *      description: Updated
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch("/edit-section/:name", 
    validator.check("new_name").isLength({min: 3}).withMessage("Section name must be at least three characters"), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PPATCH pages/edit-section/${req.body.name} - 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }
        const new_name = req.body.new_name
        const name = req.params.name

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH pages/edit-section/${req.body.name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`PATCH pages/edit-section - 401: Unauthorized access to edit`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const dup_section = await repository.get_section(new_name)
        if (dup_section){
            helpers.log_request_error(`PATCH pages/edit-section/${req.body.name} - 409: section ${name} already exists`)
            return res.status(409).json({message: `section ${name} already exists`});
        }

        const result = await repository.edit_footer_section(name, new_name)
        helpers.log_request_info(`PATCH pages/edit-section/${req.body.name} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH pages/edit-section/${req.body.name}  - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/delete-section/{name}:
 *  delete:
 *      summary: Deletes a section
 *      description: |
 *         Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to delete
 * responses:
 *    '204':
 *      description: Deleted
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.delete("/delete-section/:name", 
    async (req, res) => {
    try {
        const name = req.params.name

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`DELETE pages/delete-section/${req.params.name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`DELETE pages/delete-section/${req.params.name} - 401: Unauthorized access to edit`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const is_section = await repository.get_section(name)
        if (!is_section){
            helpers.log_request_error(`DELETE pages/delete-section/${req.params.name} - 404: Section ${name} not found`)
            return res.status(401).json({message: `Section ${name} not found`});
        }

        const result = await repository.delete_footer_section(name)
        helpers.log_request_info(`DELETE pages/delete-section/${req.params.name} - 200`)
        res.status(204).json(result);
    } catch (error) {
        helpers.log_request_error(`DELETE pages/delete-section/${req.params.name}  - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/new-page/{section_name}:
 *  post:
 *      summary: Creates a new page for a given section
 *      description: |
 *          A section name must be provided. Requires a bearer token for authentication
 * 
 *          ## Schema
 *          ### title: {required: true, type: String}
 *          ### body: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: section_name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to create the page under
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
router.post("/new-page/:section", 
    validator.check("title").isLength({min: 3}).withMessage("title must be at least three characters"), 
    validator.check("body").isLength({min: 3}).withMessage("body must be at least three characters"), 
    async (req, res) => {
    try {
        const section_name = req.params.section
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST pages/new-page/${section_name}- 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`POST pages/new-page/${section_name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`POST pages/new-page/${section_name} - 401: Unauthorized access to create`)
            return res.status(401).json({message: 'Unauthorized access to create'});
        }

        const dup_page = await repository.get_page(section_name, req.body.title)
        if (dup_page){
            helpers.log_request_error(`POST pages/new-page/${section_name} - 409: page ${req.body.title} already exists`)
            return res.status(409).json({message: `page ${req.body.title} already exists`});
        }

        const result = await repository.create_new_footer_page(section_name, req.body.title, req.body.body)
        helpers.log_request_info("POST pages/new-page/${section_name} - 200")
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`POST pages/new-page/${req.params.section}  -400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/page/{section_name}/{page_title}:
 * get:
 *   summary: Retrieves a given page by the section name and page title
 *   parameters: 
 *          - in: path
 *            name: section_name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to retrive the page from
 *          - in: path
 *            name: page_title
 *            schema:
 *              type: String
 *            required: true
 *            description: title of the page you want to retrieve
 *  
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.get("/page/:section/:title", 
    async (req, res) => {
    try {
        const page_title = req.params.title
        const section_name = req.params.section

        const page = await repository.get_page(section_name, page_title)
        if (!page){
            helpers.log_request_error(`GET pages/page/${req.params.section}/${req.params.title} - 404: page ${req.params.title} not found`)
            return res.status(404).json({message: `page ${req.params.title} not found`});
        }

        helpers.log_request_info(`GET pages/page/${req.params.section}/${req.params.title} - 200`)
        res.status(200).json(page.children[0]);
    } catch (error) {
        helpers.log_request_error(`GET pages/page/${req.params.section}/${req.params.title} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/edit-page/{section_name}/{page_title}:
 * patch:
 *   summary: Updates a page
 *   description: Requires a bearer token for authentication
 *   parameters: 
 *          - in: path
 *            name: section_name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to retrive the page from
 *          - in: path
 *            name: page_title
 *            schema:
 *              type: String
 *            required: true
 *            description: title of the page you want to update
 *  
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.patch("/edit-page/:section/:title", 
    async (req, res) => {
    try {
        const page_title = req.params.title
        const section_name = req.params.section
        const body = req.body.body
        const title = req.body.title

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 401: Unauthorized access to edit`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const page = await repository.get_page(section_name, page_title)
        if (!page){
            helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 404: page ${req.params.title} not found`)
            return res.status(404).json({message: `page ${req.params.title} not found`});
        }

        if (title && title.length < 3) {
            helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 400: title must be > 3 characters`)
            return res.status(400).json({message: `title must be > 3 characters`});
        }

        if (body && body.length < 3) {
            helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 400: body must be > 3 characters`)
            return res.status(400).json({message: `body must be > 3 characters`});
        }

        if (page_title != title){
            const dup_page = await repository.get_page(section_name, title)
            if (dup_page){
                helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 409: page ${title} already exists`)
                return res.status(409).json({message: `page ${req.body.title} already exists`});
            }
        }
        const result = await repository.update_page(section_name, page_title, {title: title, body: body})

        helpers.log_request_info(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 200`)
        res.status(201).json(result.children[0]);
    } catch (error) {
        helpers.log_request_error(`PATCH pages/edit-page/${req.params.section}/${req.params.title} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /pages/delete-page/{section_name}/{page_title}:
 * delete:
 *   summary: Deletes a page
 *   description: Requires a bearer token for authentication
 *   parameters: 
 *          - in: path
 *            name: section_name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the section to retrive the page from
 *          - in: path
 *            name: page_title
 *            schema:
 *              type: String
 *            required: true
 *            description: title of the page you want to delete
 *  
 * responses:
 *    '204':
 *      description: Delete successful
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.delete("/delete-page/:section/:title", 
    async (req, res) => {
    try {
        const page_title = req.params.title
        const section_name = req.params.section

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`DELETE pages/delete-page/${req.params.section}/${req.params.title} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        if (!auth_user.superadmin) {
            helpers.log_request_error(`DELETE pages/delete-page/${req.params.section}/${req.params.title} - 401: Unauthorized access to delete`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const page = await repository.get_page(section_name, page_title)
        if (!page){
            helpers.log_request_error(`DELETE pages/delete-page/${req.params.section}/${req.params.title} - 404: page ${req.params.title} not found`)
            return res.status(404).json({message: `page ${req.params.title} not found`});
        }

        const result = await repository.delete_page(section_name, page_title)

        helpers.log_request_info(`DELETE pages/delete-page/${req.params.section}/${req.params.title} - 200`)
        res.status(204).json(result.children[0]);
    } catch (error) {
        helpers.log_request_error(`DELETE pages/delete-page/${req.params.section}/${req.params.title} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})


/** 
 * @swagger
 * /pages/add-logo:
 *  post:
 *      summary: Adds a new logo for the footer section
 *      description: |
 *          ## Schema
 *          ### Accepts a form-data with the key "avatar"
 * responses:
 *    '201':
 *      description: Created
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post("/add-logo", 
    upload.single("avatar"),
    async (req, res) => {
        try {
        const file = req.file;

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST pages/remove-logo/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;
        
        if (!file) {
            helpers.delete_file(file.path)
            helpers.log_request_error(`POST blog/update-avatar/ - '400': validation errors`)
            return res.status(400).json({message: "No file selected"})
        }

        if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")){
            helpers.delete_file(file.path)
            helpers.log_request_error(`POST blog/update-avatar/ - 400: only .png, .jpg and .jpeg format allowed`)
            return res.status(400).json({message: "only .png, .jpg and .jpeg format allowed"});
        }

        if (file.size > 2000000) {
            helpers.delete_file(file.path)
            helpers.log_request_error(`POST blog/update-avatar/ - 400: File exceeded 2MB size limit`)
            return res.status(400).json({message: "File exceeded 2MB size limit"});
        }
        
        const logo = Model.logo({
            name: file.filename,
            original_name: file.originalname,
            path: file.path
        })
        const result = await logo.save();
        helpers.log_request_info(`POST pages/add-logo - 200`)
        res.status(200).json(result); 
    }
    catch (error) {
        helpers.log_request_error(`POST pages/add-logo/ - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }   
    
})

/** 
 * @swagger
 * /pages/all-logos:
 *  get:
 *      summary: Gets all logos
 *     
 * responses:
 *    '200':
 *      description: OK
 *    '400':
 *      description: Bad request
*/
router.get("/logos", 
    async (req, res) => {
    try {
        const result = await repository.get_all_logos();
        helpers.log_request_info(`GET pages/logos - 200`)
        res.status(200).json(result); 
    }
    catch (error) {
        helpers.log_request_error(`GET pages/logos/ - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }   
    
})

/** 
 * @swagger
 * /pages/remove-logo/{id}:
 *  post:
 *      summary: Removes a logo
 *      description: |
 *          Only the superadmin can remove
 * 
 *          Requires a bearer token for authentication
 *          
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
router.post("/remove-logo/:id", async (req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`POST pages/remove-logo/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST pages/remove-logo/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;
        const logo_id = req.params.id;

        // Guard clauses to make this op more readable
        if (!logo_id) {
            helpers.log_request_error(`POST pages/remove-logo/${req.params.id} - '400': validation errors`)
            return res.status(400).json({message: "No logo ID provided"})
        }
        
        // if both resources and files were provided
        const logo = await repository.get_logo_by_id(logo_id)
        if (!logo) {
            helpers.log_request_error(`POST pages/remove-logo/${req.params.id} - '404': Resource with id: ${resource_id} not found`)
            return res.status(404).json({message: `Resource with id: ${resource_id} not found`})
        }
        
        const result = await repository.delete_logo(logo_id);
        helpers.delete_file(logo.path)

        helpers.log_request_info(`POST pages/remove-logo/${req.params.id} - 200`)
        res.status(200).json(result); 
    } 
    catch (error) {
        helpers.log_request_error(`POST pages/remove-logo/${req.params.id} - '400': ${error.message}`)
        res.status(400).json({message: error.message})
    }
});

module.exports = router;