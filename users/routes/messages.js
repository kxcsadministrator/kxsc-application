const express = require('express');
const validator = require('express-validator');

const Model = require('../db/models');
const repository = require('../db/repository');
const helpers = require('../helpers');

const router = express.Router()

/** 
 * @swagger
 * /messages/new:
 *  post:
 *      summary: Sends a message to a recipient
 *      description: |
 *          A recipient (User's Username) and a message body must be provided.
 *          
 *          Only the superadmin can send a message
 *          
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### recipient: {required: true, type: Object ID}
 *          ### body: {required: true, type: String} 
 * responses:
 *    '200':
 *      description: Sent 
 *    '401':
 *      description: Unauthorized
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.post('/new', 
    validator.check("recipient").notEmpty().withMessage("recipient must not be empty"),
    validator.check("body").notEmpty().withMessage("body must not be empty"),
    async (req, res) => {
        try {
            // input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }

            // user validation
            if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

            const user = validateUser.data
            if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only a superadmin can send messages'});

            const recipient = await repository.get_user_by_username(req.body.recipient)
            if (!recipient) return res.status(404).json({message: `User with username ${req.body.recipient} not found`})

            if(recipient._id.toString() == user._id) return res.status(400).json({message: `You can't send a message to yourself`});

            const data = new Model.message({
                sender: user._id,
                recipients: [recipient.id],
                body: req.body.body
            });

            const result = await repository.new_message(data);
            res.status(200).json(result);

        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }
)

/** 
 * @swagger
 * /messages/broadcast:
 *  post:
 *      summary: Sends a message to all institute admins
 *      description: |
 *          A body must be provided.
 * 
 *          Only the superadmin can send a message
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### body: {required: true, type: String} 
 * responses:
 *    '200':
 *      description: Sent 
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post('/broadcast', 
    validator.check('body').notEmpty().withMessage("body must not be empty"), 
    async (req, res) => {
        try {
            // input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({ errors: errors.array() });
            }
            // user validation
            if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

            const user = validateUser.data
            if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only a superadmin can broadcast messages'});

            const result = await repository.broadcast_message(user._id, req.body.body);
            res.status(200).json(result);

        } catch (error) {
            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /messages/edit/{id}:
 *  patch:
 *      summary: Edits a previously sent message
 *      description: |
 *          A body must be provided.
 * 
 *          Only the superadmin can edit a message
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### body: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object Id
 *            required: true
 *            description: id of the message to edit
 * responses:
 *    '200':
 *      description: Sent 
 *    '401':
 *      description: Unauthorized
 *    '404':
 *      description: Message not found
 *    '400':
 *      description: Bad request
*/
router.patch('/edit/:id',
    validator.check('body').notEmpty().withMessage("body must not be empty"), 
    async (req, res) => {
    try {
        // input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        // user validation
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const user = validateUser.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only a superadmin can edit messages'});

        const msg = await repository.get_message_by_id(id);
        if (!msg) return res.status(404).json({message: `message ${id} not found`});

        const result = await repository.edit_message(id, req.body.body);
        res.status(201).json({result})
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /messages/delete/{id}:
 *  patch:
 *      summary: Deletes a previously sent message
 *      description: |
 * 
 *          Only the superadmin can delete a message
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object Id
 *            required: true
 *            description: id of the message to delete
 * responses:
 *    '204':
 *      description: Deleted
 *    '401':
 *      description: Unauthorized
 *    '404':
 *      description: Message not found
 *    '400':
 *      description: Bad request
*/
router.delete('/delete/:id',
    validator.check('body').notEmpty().withMessage("body must not be empty"), 
    async (req, res) => {
    try {
        // input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        // user validation
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const user = validateUser.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only a superadmin can delete messages'});

        const msg = await repository.get_message_by_id(id);
        if (!msg) return res.status(404).json({message: `message ${id} not found`});

        const result = await repository.delete_message(id);
        res.status(204).json({result})
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /messages/all:
 *  get:
 *      summary: Gets all the messages sent
 *      description: |
 * 
 *          Only the superadmin has access to get
 * 
 *          Requires a bearer token for authentication.
 * responses:
 *    '200':
 *      description: Successful
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/all', async (req, res) => {
    try {
        // user validation
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const user = validateUser.data
        if (!user.superadmin) return res.status(401).json({message: 'Unauthorized access. Only a superadmin view all messages'});

        const result = await repository.all_messages();
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /my-messages:
 *  get:
 *      summary: Gets all the messages the requester is a recipient of.
 *      description: |
 *          Requires a bearer token for authentication. The results depend on the user decoded from the bearer token.
 * responses:
 *    '200':
 *      description: Successful
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/my-messages', async (req, res) => {
    try {
        if (!req.headers.authorization) return res.status(401).json({message: "Token not found"});
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) return res.status(validateUser.status).json({message: validateUser.message});

        const user = validateUser.data

        const result = await repository.get_user_messages(user._id);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({message: error.message});
    }
})

module.exports = router