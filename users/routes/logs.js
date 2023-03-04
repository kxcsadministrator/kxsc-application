const express = require('express');
const logger = require('../logger');
const validator = require('express-validator');

const helpers = require('../helpers')

const router = express.Router()

router.post("/error", 
    validator.check('message').notEmpty().withMessage("message field must not be empty"),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        console.log(req.body.message)
        logger.error(req.body.message);
        return res.status(200).json
    } catch (error) {
        logger.error(`Logger Error: ${error.message}`)
    }
})

router.post("/info", 
    validator.check('message').notEmpty().withMessage("message field must not be empty"),
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        logger.info(req.body.message);
        return res.status(200).json
    } catch (error) {
        logger.error(`Logger Error: ${error.message}`)
    }
})

/** 
 * @swagger
 * /logs/all:
 *  get:
 *      summary: Returns a list of all the log files in the system
 *      description: |
 *          Only the superadmin can request for logs
 *          Requires a bearer token for authentication.
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get("/all", async(req, res) => {
    try {
        if (!req.headers.authorization) {
            helpers.log_request_error(`GET logs/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET logs/all - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(`GET logs/all - 401: Unauthorized access. Only a superadmin can view logs`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can view logs'});
        }

        const log_files = helpers.get_log_files()

        res.status(200).json(log_files)
    } catch (error) {
        logger.error(error)
    }
})

/** 
 * @swagger
 * /logs/download/${name}:
 *  get:
 *      summary: Downloads a log file by name
 *      description: |
 *          Only the superadmin can download
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: name
 *            schema:
 *              type: String
 *            required: true
 *            description: name of the file to be downloaded
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
*/
router.get("/download/:name", async(req, res) => {
    try {
        const file_name = req.params.name

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET logs/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET logs/all - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }

        const user = validateUser.data
        if (!user.superadmin) {
            helpers.log_request_error(`GET logs/all - 401: Unauthorized access. Only a superadmin can download`)
            return res.status(401).json({message: 'Unauthorized access. Only a superadmin can download'});
        }

        res.download('files/logs/' + file_name)
    } catch (error) {
        logger.error(error)
    }
})

module.exports = router