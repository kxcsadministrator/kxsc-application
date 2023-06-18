const express = require('express');
const multer = require("multer");
const validator = require('express-validator');
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const Model = require('../db/models');
const repository = require('../db/repository');
const schemas = require('../schemas/users-schema');
const helpers = require('../helpers');

const router = express.Router()

const SALT_ROUNDS = 10
const BASE_URL = process.env.BASE_URL;
const TEMPLATE_PATH = "./template/requestResetPassword.handlebars"
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

/* --------------------------------------- Routes ----------------------------------- */

/** 
 * @swagger
 * /users/new:
 *  post:
 *      summary: Creates a new regular user
 *      description: |
 *          A username, email and password must be provided
 * 
 *          ## Schema
 *          ### username: {required: true, type: String}
 *          ### email: {required: false, type: String}
 *          ### password: {required: true, type: String}
 *          ### first_name: {required: true, type: String}
 *          ### last_name: {required: true, type: String}
 *          ### phone: {required: true, type: String}
 *          ### country: {required: true, type: String}
 * responses:
 *    '201':
 *      description: Created
 *    '409':
 *      description: User already exists
 *    '400':
 *      description: Bad request
*/
router.post("/new", 
    validator.checkSchema(schemas.newUserSchema), 
    validator.check("password").isLength({min: 5}).withMessage("passwords must be at least 5 characters long"), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST /users/new - 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }

        const dup_name = await repository.get_user_by_username(req.body.username);
        if (dup_name) {
            helpers.log_request_error(`POST /users/new - 409: user with username ${req.body.username} already exists`)
            return res.status(409).json({message: `user with username ${req.body.username} already exists`});
        }

        const dup_mail = await repository.get_user_by_email(req.body.email);
        if (dup_mail) {
            helpers.log_request_error(`POST /users/new - 409: user with email ${req.body.email} already exists`)
            return res.status(409).json({message: `user with email ${req.body.email} already exists`});
        }

        const data = new Model.user({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            country: req.body.country
        })

        const result = await repository.create_new_user(data);
        helpers.log_request_info("POST /users/new - 200")
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`POST /users/new - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})


/** 
 * @swagger
 * /users/one/{id}:
 *  get:
 *      summary: Gets a user by id
 *      description: |
 *          Only the owner of the account and the superadmin has access to user's information.
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/one/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/one/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const user = await repository.clean_user_by_id(id);
        if (!user) {
            helpers.log_request_error(`GET users/one/${id} - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        // if (auth_user._id.toString() != id && auth_user.superadmin == false) {
        //     helpers.log_request_error(`GET users/one/${id} - 401: Unauthorized access to get`)
        //     return res.status(401).json({message: 'Unauthorized access to get'});
        // }
        
        helpers.log_request_info(`GET users/one/${id} - 200`)
        res.status(200).json(user);
    } catch (error) {
        helpers.log_request_error(`GET users/one/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/username/{name}:
 *  get:
 *      summary: Gets a user via the username or email
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: username of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/username/:name', async (req, res) => {
    try {
        const name = req.params.name
        const user = await repository.get_user_by_username(name);
        if (!user) {
            helpers.log_request_info(`GET users/username/${name} - 404: user with name ${name} not found`)
            return res.status(404).json({message: `user with name ${name} not found`});
        }
        helpers.log_request_info(`GET users/username/${name} - 200`)
        res.status(200).json({"id": user._id, "username": user.username});
    } catch (error) {
        helpers.log_request_error(`GET users/username/${req.params.name} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/username/{email}:
 *  get:
 *      summary: Gets a user via the username or email
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *            required: true
 *            description: username of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/username/:email', async (req, res) => {
    try {
        const email = req.params.email
        const user = await repository.get_user_by_email(email);
        if (!user) {
            helpers.log_request_info(`GET users/username/${email} - 404: user with email ${email} not found`)
            return res.status(404).json({message: `user with name ${email} not found`});
        }
        helpers.log_request_info(`GET users/username/${email} - 200`)
        res.status(200).json({"id": user._id, "username": user.email});
    } catch (error) {
        helpers.log_request_error(`GET users/username/${req.params.email} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/search-user:
 *  get:
 *      summary: Gets a user via the username or email
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: query
 *            name: name
 *            schema:
 *              type: string
 *            required: true
 *            description: username of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/search-user', async (req, res) => {
    try {
        const name = req.query.name
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/search-user?name=${name} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const users = await repository.search_username(name);

        helpers.log_request_info(`GET users/search-user?name=${name} - 200`)
        res.status(200).json(users);
    } catch (error) {
        helpers.log_request_error(`GET users/search-user?name=${req.query.name} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/edit-username/{id}:
 *  patch:
 *      summary: Changes a user's username
 *      description: |
 *         Only the owner of the account can edit the username.
 * 
 *         Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/ObjectID
 *            required: true
 *            description: id of the user to change username for
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
 *    '409':
 *      description: Duplicate
*/
router.patch('/edit-username/:id', 
    validator.check('new_username').isLength({min: 2}).withMessage("new_username must be at least three characters"), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const new_username = req.body.new_username;

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const user = await repository.get_user_by_id(id);
        if (!user) {
            helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        if (auth_user._id.toString() != id && auth_user.superadmin == false) {
            helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 401: Unauthorized access to edit`)
            return res.status(401).json({message: 'Unauthorized access to edit'});
        }

        const dup_name = await repository.get_user_by_username(new_username);
        if (dup_name) {
            helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 409: User with username ${new_username} already exists`)
            return res.status(409).json({message: `User with username ${new_username} already exists`});
        }

        const result = await repository.edit_username(id, new_username);
        helpers.log_request_info(`PATCH users/edit-username/${id} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH users/edit-username/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/change-password:
 *  patch:
 *      summary: Changes a user's password. Different from requesting a password reset.
 *      description: |
 *         The current password and desired password both needs to be provided.
 * 
 *         The user to change the password for is obtained from the request header (Bearer token)
 * 
 *         Requires a bearer token for authentication
 * 
 *         ## Schema:
 *         ### old_password: {required: true, type: String}
 *         ### new_password: {required: true, type: String}
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch('/change-password', 
    validator.checkSchema(schemas.updatePasswordSchema), 
    validator.check("old_password").isLength({min: 5}).withMessage("passwords must be at least 5 characters long"),
    validator.check("new_password").isLength({min: 5}).withMessage("passwords must be at least 5 characters long"),  
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH users/change-password - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH users/change-password - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH users/change-password - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);

        const id = auth_user._id.toString();

        // const user = await repository.get_user_by_id(id);
        // if (!user) return res.status(404).json({message: `user with id ${id} not found`});

        const data = await repository.get_user_password(id);
        if(!data) {
            helpers.log_request_error(`PATCH users/change-password - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        const verify = await bcrypt.compare(req.body.old_password, data);
        if (!verify) {
            helpers.log_request_error(`PATCH users/change-password - 401: Incorrect password`)
            return res.status(401).json({message: `Incorrect password`});
        }

        const new_hash = await bcrypt.hash(req.body.new_password, SALT_ROUNDS)
        const result = await repository.update_password(id, new_hash);

        helpers.log_request_info(`PATCH users/change-password - 200`)
        res.status(201).json(result);
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`PATCH users/change-password - 400: ${error.message}`)
        res.status(400).json({message: error.message});   
    }
})

/** 
 * @swagger
 * /users/reset-password-request:
 *  post:
 *      summary: Requests a password reset
 *      description: |
 *          A password request is validated by a token sent out via an email.
 * 
 *          The link sent to the email should be for the frontend where the user can input a new password
 *          before submitting the details to /password-reset.
 * 
 *          Such password reset validation should typically be done on the frontend.
 *          
 *          ## Schema
 *          ### username: {type: String, required: true}
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: User not found
 *    '400':
 *      description: Bad request
 *    '500':
 *      description: Internal Server Error
*/
router.post('/reset-password-request', 
    validator.check("username").notEmpty().withMessage("Username or email must be provided"),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST users/reset-password-request - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        const username = req.body.username
        
        const user = await repository.get_user_by_username_or_email(username);
        if(!user) {
            helpers.log_request_error(`POST users/reset-password-request - 404: user with name/email ${username} not found`)
            return res.status(404).json({message: `user with name/email ${username} not found`})
        };

        const id = user._id.toString();

        const token = await repository.find_existing_token(id);
        if (token) await repository.delete_token(token);

        const reset_token = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(reset_token, SALT_ROUNDS);
        const new_token = new Model.token({
            userId: id,
            token: hash
        })
        await repository.create_new_token(new_token);

        // should be handled in the frontend
        const link = `${BASE_URL}/password-reset?token=${reset_token}&id=${user._id}`;
        const email_result = await helpers.sendEmail(user.email,"Password Reset Request",{name: user.username,link: link,}, TEMPLATE_PATH);
        if (!email_result){
            helpers.log_request_info(`POST users/reset-password-request - 200`)
            return res.status(200).json({
                message: "reset link sent",
                link: link
            });
        }
        helpers.log_request_error(`POST users/reset-password-request - 500: email not sent, something went wrong`)
        res.status(500).json({message: `email not sent, something went wrong`});

    } catch (error) {
        helpers.log_request_error(`POST users/reset-password-request - 400: ${error.message}`)
        res.status(400).json({message: error.message})
    }
})

/** 
 * @swagger
 * /users/password-reset/{id}:
 *  patch:
 *      summary: Resets a users password
 *      description: |
 *         A token needs to be sent for validation. Upon validation, the password will be reset to that
 *         provided in the request.
 *          
 *         Use public=true to reset the password for a public account
 * 
 *          ## Schema
 *          ### new_password: {required: true, type: String}
 *          ### token: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/ObjectID
 *            required: true
 *            description: id of the user making the reset request
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized. Invalid reset token
 *    '400':
 *      description: Bad request
*/
router.patch('/password-reset/:id',
    validator.checkSchema(schemas.resetPasswordSchema),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH users/password-reset - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        const user_id = req.params.id;
        const token_str = req.body.token;
        const public = req.query.public;
        
        let user = null;
        if (public) {
            user = await repository.get_public_user_by_id(user_id);
        }
        else user = await repository.get_user_by_id(user_id);
        
        if (!user) {
            helpers.log_request_error(`PATCH users/password-reset - 404: user with id ${user_id} not found`)
            return res.status(404).json({message: `user with id ${user_id} not found`});
        }

        const token = await repository.find_existing_token(user_id);
        if (!token) {
            helpers.log_request_error(`PATCH users/password-reset - 404: token not found`)
            return res.status(404).json({message: `token not found`});
        }

        const token_is_valid = await bcrypt.compare(token_str, token.token);
        if (!token_is_valid) {
            helpers.log_request_error(`PATCH users/password-reset - 401: Invalid password reset token`)
            return res.status(401).json("Invalid password reset token");
        }

        const password_hash = await bcrypt.hash(req.body.new_password, SALT_ROUNDS);
        let result = null
        if (public){
            result = await repository.update_public_password(user_id, password_hash)
        }
        else {
            result = await repository.update_password(user_id, password_hash);
        }
        await repository.delete_token(token);

        helpers.log_request_info(`PATCH users/password-reset - 200`)
        res.status(201).json(result);

    } catch (error) {
        helpers.log_request_error(`PATCH users/password-reset - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/update/{id}:
 *  patch:
 *      summary: Updates a public user account
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH users/update/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const decodedToken = jwt.verify(token, SECRET_KEY);
        
        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        // if (auth_user._id != id && !auth_user.superadmin) {
        //     helpers.log_request_error(`PATCH users/update/${req.params.id} - 401: Unauthorized access`)
        //     return res.status(401).json({message: 'Unauthorized access'});
        // }

        // const user = await repository.get_user_by_id(id);
        if (!auth_user){
            helpers.log_request_error(`PATCH users/update/${req.params.id} - 404: user not fouund`)
            res.status(404).json({message: `user not fouund`});
        }
        
        const updated_user = await repository.update_user(id, req.body)
        helpers.log_request_info(`PATCH users/update/${id} - 200`)
        res.status(200).json(updated_user);
    } catch (error) {
        helpers.log_request_error(`PATCH users/update/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/login:
 *  post:
 *      summary: Validates a username/email and password combination and returns a token upon successful validation.
 *      description: |
 *          Takes an email/password or username/password combination
 * 
 *          Validates the inputs and upon correctness, sends a jwt token that can be stored as a cookie response.
 * 
 *          ## Schema
 *          ### username: {required: true, type: String}
 *          ### password: {required: true, type: String} 
 * responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: User not found
 *    '401':
 *      description: Incorrect username/password combination
 *    '400':
 *      description: Bad request
*/
router.post('/login', validator.checkSchema(schemas.loginSchema), async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST users/login - 401: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const username = req.body.username;
        const password = req.body.password;

        const user = await repository.get_user_by_username_or_email(username);
        if (!user) {
            helpers.log_request_error(`POST users/login - 404: user with username/email: ${username} not found`)
            return res.status(404).json({message: `user with username/email: ${username} not found`});
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            helpers.log_request_error(`POST users/login - 401: Incorrect password`)
            return res.status(401).json({message: `Incorrect password`});
        }

        const token = jwt.sign(
            { user_id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: "7 days" }
        )
        const photo = await repository.get_profile_photo(user.profile_picture)
        if (photo) photo.path = 'uploads/' + photo.path.split('/')[2]
        // console.log('uploads/' + photo.path.split('/')[2])
        const main_institute = await repository.get_main_institute(user._id)

        helpers.log_request_info(`POST users/login - 200`)
        res.status(200).json({ // consider using a fieldMask for this endpoint
            username: user.username,
            id: user._id,
            email: user.email,
            jwt_token: token,
            superadmin: user.superadmin,
            profile_picture: photo,
            main_institute: main_institute
        })
    } catch (error) {
        helpers.log_request_error(`POST users/login - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/my-dashboard:
 *  get:
 *      summary: Gets a user's dashboard info
 *      description: |
 *          The user is obtained from authentication token
 * 
 *          Requires a bearer token for authentication.
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/my-dashboard', async (req, res) => {
    try {
        
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/my-dashboard/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const result = await repository.get_user_dashboard(auth_user._id.toString())
        const main_institute_id = result.institute_resource._id
        let data = []
        
        if (main_institute_id != null){
            data = await repository.get_other_institutes_resources(main_institute_id)
        }
                    
        helpers.log_request_info(`GET users/my-dashboard - 200`)
        res.status(200).json(result);
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`GET users/my-dashboard - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/other-institute-resources/{id}:
 *  get:
 *      summary: Gets published resources from other institutes
 *      description: |
 *          The user is obtained from authentication token
 * 
 *          Requires a bearer token for authentication.
 *  responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get('/other-institute-resources/:id', async (req, res) => {
    try {
        
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/other-institute-resources/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const main_institute_id = req.params.id
        const data = await repository.get_other_institutes_resources(main_institute_id)
                    
        helpers.log_request_info(`GET users/other-institute-resources - 200`)
        res.status(200).json(data);
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`GET users/other-institute-resources - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})



/** 
 * @swagger
 * /users/delete/{id}:
 *  delete:
 *      summary: Delete a user
 *      description: | 
 *          Deletes a user given an id. 
 *          
 *          On the frontend, the login token should be removed upon deletion and redirect to logout.
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the user to delete
 *  responses:
 *    '204':
 *      description: deleted
 *    '404':
 *      description: Not not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        if (!req.headers.authorization) {
            helpers.log_request_error(`DELETE users/delete/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`DELETE users/delete/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const user_to_delete = await repository.get_user_by_id(id);
        if (!user_to_delete) {
            helpers.log_request_error(`DELETE users/delete/${req.params.id} - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        if (auth_user._id.toString() != id && auth_user.superadmin == false) {
            helpers.log_request_error(`DELETE users/delete/${req.params.id} - 401: Unauthorized access to delete`)
            return res.status(401).json({message: 'Unauthorized access to delete'});
        }
    
        const result = await repository.delete_user(user_to_delete);
        helpers.log_request_info(`DELETE users/delete/${id} - 200`)
        res.status(204).json(result);
        // log user out upon delete and delete his token
    } catch (error) {
        helpers.log_request_error(`DELETE users/delete/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/change-profile-photo/{id}:
 *  post:
 *      summary: Uploads/updates the photo for the given user.
 *      description: |
 *          Uploads a file. Restricted to png, jpg and jpeg files. File size must not exceed 2MB
 * 
 *          ## Schema
 *          Accepts a form-data with the key "file"
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the user to change the profile picture
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post('/change-profile-photo/:id', upload.single("file"), async (req, res) => {
    const file = req.file;
    try {
       
        const id = req.params.id;

        if (!file) {
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 400: No file selected`)
            return res.status(400).json({message: "No file selected"});
        }
        
        if (!(file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg")){
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 400: only .png, .jpg and .jpeg format allowed`)
            helpers.delete_file(file.path)
            return res.status(400).json({message: "only .png, .jpg and .jpeg format allowed"});
        }

        if (file.size > 2000000) {
            helpers.delete_file(file.path)
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 400: File exceeded 2MB size limit`)
            return res.status(400).json({message: "File exceeded 2MB size limit"});
        }


        if (!req.headers.authorization) {
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const user = await repository.get_user_by_id(id);
        if (!user) {
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        if (auth_user._id.toString() != id && auth_user.superadmin == false) {
            helpers.log_request_error(`POST users/change-profile-photo/${id} - 401: Unauthorized access`)
            return res.status(401).json({message: 'Unauthorized access'});
        }

        const photo = new Model.profilePic({
            name: file.filename,
            original_name: file.originalname,
            path: `${FILE_PATH}${file.filename}`,
            user: id
        })
        
        const result = await repository.add_profile_photo(id, photo);

        helpers.log_request_info(`POST users/change-profile-photo/${id} - 200`)
        res.status(201).json(result);        
    } catch (error) {
        helpers.delete_file(file.path)
        helpers.log_request_error(`POST users/change-profile-photo/${id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/remove-profile-photo/{id}:
 *  post:
 *      summary: removes the photo for the given user.
 *      description: |
 *          Removes a file from storage and the photo from the profile of the user.
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the user to remove the profile picture
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post('/remove-profile-photo/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`POST users/remove-profile-photo/${id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`POST users/remove-profile-photo/${id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const user = await repository.get_user_by_id(id);
        if (!user) {
            helpers.log_request_error(`POST users/remove-profile-photo/${id} - 404: user with id ${id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        if (auth_user._id.toString() != id && auth_user.superadmin == false) {
            helpers.log_request_error(`POST users/remove-profile-photo/${id} - 401: Unauthorized access`)
            return res.status(401).json({message: 'Unauthorized access'});
        }
        
        if(!user.profile_picture) {
            helpers.log_request_error(`POST users/remove-profile-photo/${id} - 404: No profile picture attached`)
            return res.status(404).json({message: "No profile picture attached"});
        }

        const result = await repository.remove_profile_photo(user.profile_picture, id);
        helpers.log_request_info(`POST users/remove-profile-photo/${id} - 200`)
        res.status(200).json(result);        
    } catch (error) {
        helpers.log_request_error(`POST users/remove-profile-photo/${id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/get-user-from-token:
 *  post:
 *      summary: gets a current user detail via bearer token
 *      description: |
 *          Will return 4xx if the user could not been validated
 *          ### Schema
 *          ## token: {required: true, type: String}
 * responses:
 *    '200':
 *      description: Validated, Ok
 *    '404':
 *      description: User not found
 *    '400':
 *      description: Bad request/Invalid signature
*/
router.post('/get-user-from-token',
    validator.check("token").notEmpty().withMessage("token field must not be empty"),
    async (req, res) => {
        try {
            const token = req.body.token;

            const decodedToken = jwt.verify(token, SECRET_KEY);

            const user = await repository.get_user_by_id(decodedToken.user_id);
            
            if (!user) {
                helpers.log_request_error(`POST users/get-user-from-token - 404: user with id ${decodedToken.user_id} not found`)
                return res.status(404).json({message: `user with id ${decodedToken.user_id} not found`});
            }
            
            helpers.log_request_info(`POST users/get-user-from-token - 200`)
            res.status(200).json(user);
        } catch (error) {
            helpers.log_request_error(`POST users/get-user-from-token - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /users/validate-user:
 *  post:
 *      summary: gets a user detail via username or email
 *      description: |
 *          Will return 404 if the user could not be found
 *          ### Schema
 *          ## username: {required: true, type: String}
 * responses:
 *    '200':
 *      description: Validated, Ok
 *    '404':
 *      description: User not found
 *    '400':
 *      description: Bad request
*/
router.post('/validate-user',
    validator.check("username").notEmpty().withMessage("username field must not be empty"),
    async (req, res) => {
        try {
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`POST users/validate-user - 400: validation errors`)
                return res.status(400).json({ errors: errors.array() });
            }
            const username = req.body.username;

            const user = await repository.get_user_by_username_or_email(username)
            
            if (!user) {
                helpers.log_request_error(`POST users/validate-user - 404: user with username/email ${username} not found`)
                return res.status(404).json({message: `user with username/email ${username} not found`});
            }

            let user_data = {username: user.username, email: user.email, id: user._id}

            helpers.log_request_info(`POST users/validate-user - 200`)
            
            res.status(200).json(user_data);
        } catch (error) {
            helpers.log_request_error(`POST users/validate-user - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
})



/** 
 * @swagger
 * /users/institute-data/{institute_id}:
 *  get:
 *      summary: Gets an institute's user data in readable format
 *      description: |
 *          Only the superadmin has access to get
 * 
 *          Requires a bearer token for authentication.
 * responses:
 *    '200':
 *      description: Ok
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/institute-data/:id', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET users/institute-data/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/institute-data/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const id = req.params.id;

        const [members, admins, resources] = await repository.get_institute_members(id);
        result = {"admins": admins, "members": members, "resources": resources}

        helpers.log_request_info(`GET users/institute-data/${id} - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET users/institute-data/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/task-data:
 *  get:
 *      summary: Gets a task's user data in readable format
 *      description: |
 *          Only the superadmin has access to get
 * 
 *          Requires a bearer token for authentication.
 *          
 * responses:
 *    '200':
 *      description: Ok
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/task-data',
    // validator.check("author").notEmpty().withMessage("author field must not be empty"), 
    // validator.check("collabs").notEmpty().withMessage("collabs field must not be a non-empty list"),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`GET users/task-data/ - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET users/task-data/ - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        // const token = req.headers.authorization.split(' ')[1];
        // if (!token) {
        //     helpers.log_request_error(`GET users/task-data/ - 401: Token not found`)
        //     return res.status(401).json({message: "Token not found"});
        // }

        // const decodedToken = jwt.verify(token, SECRET_KEY);

        const author_id = req.body.author;
        const collab_idx = req.body.collabs

        const [author, collabs] = await repository.get_task_members(author_id, collab_idx)
        result = {"author": author, "collaborators": collabs}

        helpers.log_request_info(`GET users/task-data/ - 200`)
        res.status(200).json(result);
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`GET users/task-data/ - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})


router.get('/resource-data/:id', async (req, res) => {
    try {
        const id = req.params.id
        // if (!req.headers.authorization) {
        //     helpers.log_request_error(`GET users/resource-data/${req.params.id} - 401: Token not found`)
        //     return res.status(401).json({message: "Token not found"});
        // }
        // const token = req.headers.authorization.split(' ')[1];
        // if (!token) {
        //     helpers.log_request_error(`GET users/resource-data/${req.params.id} - 401: Token not found`)
        //     return res.status(401).json({message: "Token not found"});
        // }

        // const decodedToken = jwt.verify(token, SECRET_KEY);

        // const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const [author, institute] = await repository.get_resource_data(id);

        helpers.log_request_info(`GET users/resource-data/${id} - 200`)
        res.status(200).json({"author": author, "institute": institute});
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`GET users/resource-data/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

router.post('/resources-data', async (req, res) => {
    try {
        const resources_idx = req.body.resources;

        const result = await repository.get_resources_readable(resources_idx)

        helpers.log_request_info(`POST users/resource-data - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`POST users/resource-data - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})


router.get('/:id/resource-search', async (req, res) => {
    try {
        const institute_id = req.params.id
        const name = req.query.name
        const data = await repository.search_resource(name, institute_id)

        helpers.log_request_info(`GET users/resource-search - 200`)
        res.status(200).json(data)
    } catch (error) {
        helpers.log_request_error(`GET users/resource-search - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
    
})

/*--------------------------------------- Public User Routes --------------------------------------*/
/** 
 * @swagger
 * /users/new-public-user:
 *  post:
 *      summary: Creates a new public user
 *      description: |
 *          A username, email and password must be provided
 * 
 *          ## Schema
 *          ### username: {required: true, type: String}
 *          ### email: {required: false, type: String}
 *          ### password: {required: true, type: String} 
 *          ### first_name: {required: true, type: String}
 *          ### last_name: {required: true, type: String}
 *          ### phone: {required: true, type: String}
 *          ### country: {required: true, type: String}
 * responses:
 *    '201':
 *      description: Created
 *    '409':
 *      description: User already exists
 *    '400':
 *      description: Bad request
*/
router.post("/new-public-user", 
    validator.checkSchema(schemas.newUserSchema), 
    validator.check("password").isLength({min: 5}).withMessage("passwords must be at least 5 characters long"), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST /users/new-public-user - 400: validation error(s)`)
            return res.status(400).json({ errors: errors.array() });
        }

        const dup_name = await repository.get_public_user_by_username(req.body.username);
        if (dup_name) {
            helpers.log_request_error(`POST /users/new-public-user - 409: user with username ${req.body.username} already exists`)
            return res.status(409).json({message: `user with username ${req.body.username} already exists`});
        }

        const dup_mail = await repository.get_public_user_by_email(req.body.email);
        if (dup_mail) {
            helpers.log_request_error(`POST /users/new-public-user - 409: user with email ${req.body.email} already exists`)
            return res.status(409).json({message: `user with email ${req.body.email} already exists`});
        }

        const data = new Model.publicUser({
            username: req.body.username,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, SALT_ROUNDS),
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            phone: req.body.phone,
            country: req.body.country
        })

        const result = await repository.create_new_user(data);
        helpers.log_request_info("POST /users/new-public-user - 200")
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`POST /users/new-public-user - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/public/all:
 *  get:
 *      summary: Gets all public user accounts
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/public/all', async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/one/public/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const decodedToken = jwt.verify(token, SECRET_KEY);
        
        // const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const users = await repository.get_all_public_users();
        
        helpers.log_request_info(`GET users/one/public/${id} - 200`)
        res.status(200).json(users);
    } catch (error) {
        helpers.log_request_error(`GET users/one/public/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/public/one/{id}:
 *  get:
 *      summary: Gets a public user by id
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get('/public/one/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/one/public/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const decodedToken = jwt.verify(token, SECRET_KEY);
        const user = await repository.get_public_user_by_id(id);
        
        helpers.log_request_info(`GET users/one/public/${id} - 200`)
        res.status(200).json(user);
    } catch (error) {
        helpers.log_request_error(`GET users/one/public/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/public/update/{id}:
 *  patch:
 *      summary: Updates a public user account
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.patch('/public/update/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/one/public/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const decodedToken = jwt.verify(token, SECRET_KEY);
        
        // const auth_user = await repository.get_user_by_id(decodedToken.user_id);

        const user = await repository.get_public_user_by_id(id);
        if (!user){
            helpers.log_request_error(`PATCH users//public/update/${req.params.id} - 404: user not fouund`)
            res.status(404).json({message: `user not fouund`});
        }
        const updated_user = await repository.update_public_user(id, req.body)
        helpers.log_request_info(`PATCH users//public/update/${id} - 200`)
        res.status(200).json(updated_user);
    } catch (error) {
        helpers.log_request_error(`PATCH users//public/update/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/public/delete/{id}:
 *  delete:
 *      summary: Deletes a public user account
 *      description: |
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the user to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.delete('/public/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`GET users/one/public/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const decodedToken = jwt.verify(token, SECRET_KEY);
        
        // const auth_user = await repository.get_user_by_id(decodedToken.user_id);
        const user = await repository.get_public_user_by_id(id);
        if (!user){
            helpers.log_request_error(`DELETE users//public/delete/${req.params.id} - 404: user not fouund`)
            res.status(404).json({message: `user not fouund`});
        }
        await repository.delete_public_user(id)
        helpers.log_request_info(`DELETE users//public/delete/${id} - 200`)
        res.status(200).json({message: "successful"});
    } catch (error) {
        helpers.log_request_error(`DELETE users/public/delete/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/public/login:
 *  post:
 *      summary: Validates a username/email and password combination and returns a token upon successful validation.
 *      description: |
 *          Takes an email/password or username/password combination
 * 
 *          Validates the inputs and upon correctness, sends a jwt token that can be stored as a cookie response.
 * 
 *          ## Schema
 *          ### username: {required: true, type: String}
 *          ### password: {required: true, type: String} 
 * responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: User not found
 *    '401':
 *      description: Incorrect username/password combination
 *    '400':
 *      description: Bad request
*/
router.post('/public/login', validator.checkSchema(schemas.loginSchema), async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST users/public/login - 401: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const username = req.body.username;
        const password = req.body.password;

        const user = await repository.get_public_user_by_username_or_email(username);
        if (!user) {
            helpers.log_request_error(`POST users/public/login - 404: user with username/email: ${username} not found`)
            return res.status(404).json({message: `user with username/email: ${username} not found`});
        }

        const verify = await bcrypt.compare(password, user.password);
        if (!verify) {
            helpers.log_request_error(`POST users/public/login - 401: Incorrect password`)
            return res.status(401).json({message: `Incorrect password`});
        }

        const token = jwt.sign(
            { user_id: user._id, email: user.email },
            SECRET_KEY,
            { expiresIn: "7 days" }
        )
        helpers.log_request_info(`POST users/public/login - 200`)

        res.status(200).json({ // consider using a fieldMask for this endpoint
            username: user.username,
            id: user._id,
            email: user.email,
            jwt_token: token,
        })
    } catch (error) {
        helpers.log_request_error(`POST users/public/login - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /users/public/change-password:
 *  patch:
 *      summary: Changes a user's password. Different from requesting a password reset.
 *      description: |
 *         The current password and desired password both needs to be provided.
 * 
 *         The user to change the password for is obtained from the request header (Bearer token)
 * 
 *         Requires a bearer token for authentication
 * 
 *         ## Schema:
 *         ### old_password: {required: true, type: String}
 *         ### new_password: {required: true, type: String}
 * responses:
 *    '201':
 *      description: Updated
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch('/public/change-password', 
    validator.checkSchema(schemas.updatePasswordSchema), 
    validator.check("old_password").isLength({min: 5}).withMessage("passwords must be at least 5 characters long"),
    validator.check("new_password").isLength({min: 5}).withMessage("passwords must be at least 5 characters long"),  
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH users/public/change-password - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH users/public/change-password - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            helpers.log_request_error(`PATCH users/public/change-password - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const decodedToken = jwt.verify(token, SECRET_KEY);

        const auth_user = await repository.get_public_user_by_id(decodedToken.user_id);
        if(!auth_user) {
            helpers.log_request_error(`PATCH users/public/change-password - 404: user with id ${decodedToken.user_id} not found`)
            return res.status(404).json({message: `user with id ${id} not found`});
        }

        const verify = await bcrypt.compare(req.body.old_password, auth_user.password);
        if (!verify) {
            helpers.log_request_error(`PATCH users/public/change-password - 401: Incorrect password`)
            return res.status(401).json({message: `Incorrect password`});
        }

        const new_hash = await bcrypt.hash(req.body.new_password, SALT_ROUNDS)
        const result = await repository.update_public_password(auth_user._id, new_hash);

        helpers.log_request_info(`PATCH users/public/change-password - 200`)
        res.status(201).json({message: 'Update successful'});
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`PATCH users/public/change-password - 400: ${error.message}`)
        res.status(400).json({message: error.message});   
    }
})

/** 
 * @swagger
 * /users/public/reset-password-request:
 *  post:
 *      summary: Requests a password reset
 *      description: |
 *          A password request is validated by a token sent out via an email.
 * 
 *          The link sent to the email should be for the frontend where the user can input a new password
 *          before submitting the details to /password-reset.
 * 
 *          Such password reset validation should typically be done on the frontend.
 *          
 *          ## Schema
 *          ### username: {type: String, required: true}
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: User not found
 *    '400':
 *      description: Bad request
 *    '500':
 *      description: Internal Server Error
*/
router.post('/public/reset-password-request', 
    validator.check("username").notEmpty().withMessage("Username or email must be provided"),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST users/public/reset-password-request - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        const username = req.body.username
        
        const user = await repository.get_public_user_by_username_or_email(username);
        if(!user) {
            helpers.log_request_error(`POST users/public/reset-password-request - 404: user with name/email ${username} not found`)
            return res.status(404).json({message: `user with name/email ${username} not found`})
        };

        const id = user._id.toString();

        const token = await repository.find_existing_token(id);
        if (token) await repository.delete_token(token);

        const reset_token = crypto.randomBytes(32).toString("hex");
        const hash = await bcrypt.hash(reset_token, SALT_ROUNDS);
        const new_token = new Model.token({
            userId: id,
            token: hash
        })
        await repository.create_new_token(new_token);

        // should be handled in the frontend
        const link = `${BASE_URL}/password-reset?token=${reset_token}&id=${user._id}&public=true`;
        const email_result = await helpers.sendEmail(user.email,"Password Reset Request",{name: user.username,link: link,}, TEMPLATE_PATH);
        if (!email_result){
            helpers.log_request_info(`POST users/public/reset-password-request - 200`)
            return res.status(200).json({
                message: "reset link sent",
                link: link
            });
        }
        helpers.log_request_error(`POST users/public/reset-password-request - 500: email not sent, something went wrong`)
        res.status(500).json({message: `email not sent, something went wrong`});

    } catch (error) {
        helpers.log_request_error(`POST users/public/reset-password-request - 400: ${error.message}`)
        res.status(400).json({message: error.message})
    }
})

module.exports = router;