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
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### recipient: {required: true, type: Object ID}
 *          ### subject: {required: true, type: String}
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
    validator.check("subject").notEmpty().withMessage("subject must not be empty"),
    validator.check("body").notEmpty().withMessage("body must not be empty"),
    async (req, res) => {
        try {
            // input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`POST messages/new - 400: validation errors`)
                return res.status(400).json({ errors: errors.array() });
            }

            // user validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`POST messages/new - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`POST messages/new - ${validateUser.status}: ${validateUser.message}`)
                return res.status(validateUser.status).json({message: validateUser.message});
            }

            const user = validateUser.data
            // if (!user.superadmin) {
            //     helpers.log_request_error(`POST messages/new - 401: Unauthorized access. Only a superadmin can send messages`)
            //     return res.status(401).json({message: 'Unauthorized access. Only a superadmin can send messages'});
            // }

            const recipient = await repository.get_user_by_username(req.body.recipient)
            if (!recipient) {
                helpers.log_request_error(`POST messages/new - 404: Recipient with username ${req.body.recipient} not found`)
                return res.status(404).json({message: `Recipient with username ${req.body.recipient} not found`})
            }

            if(recipient._id.toString() == user._id) {
                helpers.log_request_error(`POST messages/new - 400: You can't send a message to yourself`)
                return res.status(400).json({message: `You can't send a message to yourself`});
            }

            const data = new Model.message({
                sender: user._id,
                recipients: [recipient.id],
                subject: req.body.subject,
                body: req.body.body
            });

            const result = await repository.new_message(data);

            helpers.log_request_info(`POST messages/new - 200`)
            const notification = new Model.notification({
                type: "message",
                owner: recipient._id
            })
            const notify_res = await repository.create_new_notification(notification);
            
            // clients is a list of response objects
            if (recipient._id.toString() in helpers.clients){
                const [msg, req] = await repository.get_user_notifications(recipient._id.toString())
                const data = {messages: msg, requests: req}
                helpers.clients[recipient._id.toString()].write(`data: ${JSON.stringify(data)}\n\n`)
            }
            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`POST messages/new - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
    }
)

/** 
 * @swagger
 * /messages/send-institute-notification/{id}:
 *  post:
 *      summary: Creates a notification for an institute admin       
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
router.post('/send-institute-notification/:id', 
    async (req, res) => {
        try {
            const id = req.params.id
            // user validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`POST messages/new - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200) {
                helpers.log_request_error(`POST messages/new - ${validateUser.status}: ${validateUser.message}`)
                return res.status(validateUser.status).json({message: validateUser.message});
            }

            helpers.send_instiute_notification(id);
            res.status(200).json({message: 'Successful'});
        } catch (error) {
            helpers.log_request_error(`POST messages/new - 400: ${error.message}`)
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
    validator.check("subject").notEmpty().withMessage("subject must not be empty"),
    validator.check('body').notEmpty().withMessage("body must not be empty"), 
    async (req, res) => {
        try {
            // input validation
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`POST messages/broadcast - 400: validation errors`)
                return res.status(400).json({ errors: errors.array() });
            }
            // user validation
            if (!req.headers.authorization) {
                helpers.log_request_error(`POST messages/broadcast - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const validateUser = await helpers.validateUser(req.headers);
            if (validateUser.status !== 200){ 
                helpers.log_request_error(`POST messages/broadcast - ${validateUser.status}: ${validateUser.message}`)
                return res.status(validateUser.status).json({message: validateUser.message});
            }

            const user = validateUser.data
            if (!user.superadmin) {
                helpers.log_request_error(`POST messages/broadcast - 401: Unauthorized access. Only a superadmin can broadcast messages`)
                return res.status(401).json({message: 'Unauthorized access. Only a superadmin can broadcast messages'});
            }

            const result = await repository.broadcast_message(user._id, req.body.subject, req.body.body);

            helpers.log_request_info(`POST messages/broadcast - 200`)
            res.status(200).json(result);

        } catch (error) {
            helpers.log_request_error(`POST messages/broadcast - 400: ${error.message}`)
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
            helpers.log_request_error(`PATCH messages/edit/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        // user validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH messages/edit/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH messages/edit/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        // if (!user.superadmin) {
        //     helpers.log_request_error(`PATCH messages/edit/${req.params.id} - 401: Unauthorized access. Only a superadmin can edit messages`)
        //     return res.status(401).json({message: 'Unauthorized access. Only a superadmin can edit messages'});
        // }

        const msg = await repository.get_message_by_id(id);
        if (!msg) {
            helpers.log_request_error(`PATCH messages/edit/${req.params.id} - 404: message ${id} not found`)
            return res.status(404).json({message: `message ${id} not found`});
        }

        console.log(msg.sender, '---', user._id)
        if (msg.sender.toString() != user._id.toString()) {
            helpers.log_request_error(`PATCH messages/edit/${req.params.id} - 401: Unauthorized access. You can only edit your messages`)
            return res.status(401).json({message: 'Unauthorized access. You can only edit your messages'});
        }

        const result = await repository.edit_message(id, req.body.body);

        helpers.log_request_info(`PATCH messages/edit/${id} - 200`)
        res.status(201).json({result})
    } catch (error) {
        helpers.log_request_error(`PATCH messages/edit/${req.params.id} - 400: ${error.message}`)
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
    async (req, res) => {
    try {
        // input validation
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH messages/delete/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        // user validation
        if (!req.headers.authorization) {
            helpers.log_request_error(`DELETE messages/delete/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`DELETE messages/delete/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        // if (!user.superadmin) {
        //     helpers.log_request_error(`PATCH messages/delete/${req.params.id} - 401: Unauthorized access. Only a superadmin can delete messages`)
        //     return res.status(401).json({message: 'Unauthorized access. Only a superadmin can delete messages'});
        // }

        const msg = await repository.get_message_by_id(id);
        if (!msg) return res.status(404).json({message: `message ${id} not found`});

        if (msg.sender.toString() != user._id.toString() && user.superadmin == false) {
            helpers.log_request_error(`DELETE messages/delete/${req.params.id} - 401: Unauthorized access to delete`)
            return res.status(401).json({message: 'Unauthorized access to delete'});
        }

        const result = await repository.delete_message(id);

        helpers.log_request_info(`DELETE messages/delete/${id} - 200`)
        res.status(204).json({result})
    } catch (error) {
        helpers.log_request_error(`DELETE messages/delete/${req.params.id} - 400: ${error.message}`)
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
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET messages/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET messages/all - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(`GET messages/all - 401: Unauthorized access. Only a superadmin view all messages`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin view all messages'})
        };

        const result = await repository.all_messages();

        helpers.log_request_info(`GET messages/all - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET messages/all - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /messages/my-messages:
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
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET messages/my-messages - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET messages/my-messages - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data

        const result = await repository.get_user_messages(user._id);

        helpers.log_request_info(`GET messages/my-messages - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET messages/my-messages - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /messages/sent-messages:
 *  get:
 *      summary: Gets all the messages the requester is a sender of.
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
router.get('/sent-messages', async (req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET messages/my-messages - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET messages/my-messages - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data

        const result = await repository.get_user_sent_messages(user._id);

        helpers.log_request_info(`GET messages/my-messages - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET messages/my-messages - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /messages/notifications/{id}:
 *  get:
 *      summary: A long-lived connection for recieving SSEs.
 *      description: |
 *          Use for getting notifications in real-time
 * responses:
 *    '200':
 *      description: Successful
 *    '500':
 *      description: Internal Server Error
*/
router.get('/notifications/:id', async(req, res) => {
    try {
        const headers = {
            'Content-Type': 'text/event-stream',
            'Connection': 'keep-alive',
            'Cache-Control': 'no-cache'
        };
        const user_id = req.params.id
        console.log(`${user_id} Connection opened`)
        // helpers.log_request_info(`${user_id} Connection opened`)
        res.writeHead(200, headers);
        
        const [messages, pub_requests, user_requests] = await repository.get_user_notifications(user_id)
        const data = {messages: messages, publish_requests: pub_requests, new_user_requests: user_requests}
        const result = `data: ${JSON.stringify(data)}\n\n`;
        
        res.write(result);
        
        helpers.clients[user_id] = res;
        
        req.on('close', () => {
            console.log(`${user_id} Connection closed`);
            // helpers.log_request_info(`${user_id} Connection closed`)
            delete helpers.clients[user_id]
        });
    } catch (error) {
        console.error(error)
        helpers.log_request_error(`GET messages/notifications - 500: ${error.message}`)
        res.status(500).json({message: error.message});
    }
})

/** 
 * @swagger
 * /messages/notifications:
 *  delete:
 *      summary: Delete read notifications
 *      description: |
 *          Use for deleting notifications that have been seen. Requires a bearer token for authentication
 * responses:
 *    '204':
 *      description: Successful
 *    '500':
 *      description: Internal Server Error
*/
router.delete('/notifications', async(req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET messages/my-messages - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET messages/my-messages - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        console.log(user._id)
        
        await repository.delete_user_notification(user._id)
        return res.status(204).json({message: "successful"})
    } catch (error) {
        helpers.log_request_error(`GET messages/notifications - 500: ${error.message}`)
        res.status(500).json({message: error.message});
    }
})

module.exports = router