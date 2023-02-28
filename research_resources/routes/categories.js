const express = require('express');
const axios = require('axios');
const validator = require('express-validator');

const Model = require('../db/models');
const repository = require('../db/repository');
const { json } = require('body-parser');

const USERS_BASE_URL = process.env.USERS_SERVICE

const router = express.Router()
/** 
 * @swagger
 * /categories/new:
 *  post:
 *      summary: Inserts a new category into the db
 *      description: |
 *          Only superadmins can create categories.
 * 
 *          Requires a bearer token for authentication.
 *          Will only insert if the category doesn't exist. (Categories are unique)
 *          ## Schema
 *          ### name: {required: true, type: string}
 *          ### sub_categories: {required: true, type: [string]} 
 *      
 * responses:
 *    '201':
 *      description: Created
 *    '400':
 *      description: Bad request/ Category already exists
 *    '401':
 *      description: Unauthorized
 *    '409':
 *      description: Duplicate
*/
router.post('/new', 
    validator.check("name").isLength({min: 2}).withMessage("name field must be at least 2 characters"),
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const unique_subs = new Set(req.body.sub_categories)
        
        const data = new Model.category({
            name: req.body.name,
            sub_categories: Array.from(unique_subs)
        });

         // user authentication
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({message: "Token not found"});

        const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {
            token: token
        });
        if (auth_user_res.status != 200) return res.status(401).json({message: "Unauthorized access. Invalid User"});

        const user = auth_user_res.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can create categories'});

        const cat = await repository.get_category_by_name(req.body.name);
        if (cat) return res.status(409).json({message: "Category already exists"});

        const dataToSave = await repository.create_new_category(data);
        res.status(201).json(dataToSave);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
    
})

/** 
 * @swagger
 * /categories/category/{id}:
 *  get:
 *      summary: Gets a category by id
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the category to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
*/
router.get('/category/:id', async (req, res) => {
    try{
        const category = await repository.get_category_by_id(req.params.id)
        if (category){
            res.status(200).json(category);
        }
        else res.status(404).json({message: "Category not found"});
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /categories/one:
 *  get:
 *      summary: Gets a category by name
 *      parameters: 
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *            description: name of the category to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
*/

router.get('/one', async (req, res) => {
    try{
        if (!req.query.name)return res.status(400).json({message: "A 'name' must be provided as a query parameter"});
        const category = await repository.get_category_by_name(req.query.name);
        if (category){
            res.status(200).json(category);
        }
        else res.status(404).json({message: "Category not found"});
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /categories/all:
 *  get:
 *      summary: Gets all categories
 *      description: returns an empty payload if there are no categories in the db
 * 
 *  responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/all', async (req, res) => {
    try{
        const data = await repository.get_all_categories()
        res.status(200).json(data);
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /categories/subs:
 *  get:
 *      summary: Gets all sub-categories for a given category
 *      description: returns an empty payload if there are no sub-categories
 *      parameters: 
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *            description: name of the category to get sub-categories for
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
*/
router.get('/subs', async (req, res) => {
    try{
        if (!req.query.name)return res.status(400).json({message: "A 'name' must be provided as a query parameter"});
        const category = await repository.get_category_by_name(req.query.name);
        if (category){
            res.status(200).json(category.sub_categories);
        }
        else res.status(404).json({message: "Category not found"});
    }
    catch(error){
        res.status(400).json({message: error.message});
    }
})
/** 
 * @swagger
 * /categories/rename/{id}:
 *  patch:
 *      summary: Updates the name of a category given an id.
 *      description: |
 *          Only superadmins can rename categories.
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### name: {required: true, type: String} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the category to update
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
 *    '409':
 *      description: Duplicate
 *    '401':
 *      description: Unauthorized
*/
router.patch('/rename/:id', 
    validator.check("name").isLength({min: 2}).withMessage("name field must be at least 2 characters"), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // user authentication
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({message: "Token not found"});

        const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {
            token: token
        });
        if (auth_user_res.status != 200) return res.status(401).json({message: "Unauthorized access. Invalid User"});

        const user = auth_user_res.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can update category names'});

        const category = await repository.get_category_by_id(req.params.id)
        if (!category) return res.status(404).json({message: "Category not found"});
        
        const dup_cat = await repository.get_category_by_name(req.body.name);
        if (dup_cat) return res.status(409).json({message: `Category ${req.body.name} already exists`})

        const result = await repository.update_category_by_id(req.params.id, req.body.name);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /categories/add-subcategories/{id}:
 *  patch:
 *      summary: Adds sub-categories for a given category
 *      description: |
 *          Only superadmins can add sub-categories.
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### sub_categories: {required: true, type: [String]} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the category to add for
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/add-subcategories/:id', 
    validator.check('sub_categories').custom(value => {
    if (!(Array.isArray(value) && value.length > 0)) throw new Error("sub_categories field must be a non-empty array");
    return true;
    }), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // user authentication
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({message: "Token not found"});

        const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {
            token: token
        });
        if (auth_user_res.status != 200) return res.status(401).json({message: "Unauthorized access. Invalid User"});

        const user = auth_user_res.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can add sub-categories'});

        const category = await repository.get_category_by_id(req.params.id)
        if (!category) return res.status(404).json({message: "Category not found"});
        
        const result = await repository.add_sub_categories(req.params.id, req.body.sub_categories);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /categories/remove-subcategories/{id}:
 *  patch:
 *      summary: Removes sub-categories for a given category
 *      description: |
 *          Only superadmins can remove sub-categories.
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### sub_categories: {required: true, type: [String]} 
 * 
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id of the category to remove from
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/remove-subcategories/:id', 
    validator.check('sub_categories').custom(value => {
    if (!(Array.isArray(value) && value.length > 0)) throw new Error("sub_categories field must be a non-empty array");
    return true;
    }), 
    async (req, res) => {
    try {
        //input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        // user authentication
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) return res.status(401).json({message: "Token not found"});

        const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {
            token: token
        });
        if (auth_user_res.status != 200) return res.status(401).json({message: "Unauthorized access. Invalid User"});

        const user = auth_user_res.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can remove sub-categories'});

        const category = await repository.get_category_by_id(req.params.id)
        if (!category) return res.status(404).json({message: "Category not found"});
        
        const result = await repository.remove_sub_categories(req.params.id, req.body.sub_categories);
        res.status(201).json(result);
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

/** 
 * @swagger
 * /categories/delete/{id}:
 *  delete:
 *      summary: Deletes a category given an ID
 *      description: |
 *          Only superadmins can delete categories.
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: id of the category to delete
 *  responses:
 *    '204':
 *      description: deleted
 *    '404':
 *      description: category not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.delete('/delete/:id', async (req, res) => {
    try {
         // user authentication
         if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
         const token = req.headers.authorization.split(' ')[1];
         if (!token) return res.status(401).json({message: "Token not found"});
 
         const auth_user_res = await axios.post(`${USERS_BASE_URL}/get-user-from-token`, {
             token: token
         });
         if (auth_user_res.status != 200) return res.status(401).json({message: "Unauthorized access. Invalid User"});

         const user = auth_user_res.data
         if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only superadmins can delete categories'});

        const category = await repository.get_category_by_id(req.params.id);
        if (!category) return res.status(404).json({message: "Category not found"});

        const data = await repository.delete_category_by_id(req);
        res.status(204).json({message: `Category with name: ${data.name} has been deleted..`}) 
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router;