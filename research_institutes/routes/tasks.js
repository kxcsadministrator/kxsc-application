const express = require('express');
const multer = require("multer");
const validator = require('express-validator');

const Model = require('../db/models');
const repository = require('../db/repository');
const schemas = require('../schemas/task-schema');
const helpers = require('../helpers');

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


/*------------------------------------- Routes -----------------------------------------*/

/** 
 * @swagger
 * /tasks/new/{id}:
 *  post:
 *      summary: Creates a new task for a given  institute
 *      description: |
 *          Only the institute admin can create a task.
 * 
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### name: {required: true, type: string}
 *          ### author: {required: false, type: User}
 *          ### institute: {required: true, type: UUID, default: institute_id}
 *          
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to create a new task for
 * responses:
 *    '201':
 *      description: Created
 *    '409':
 *      description: task with name already exists
 *    '404':
 *      description: institute not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post("/new/:id", validator.checkSchema(schemas.newTaskSchema), async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST tasks/new/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        const institute_id = req.params.id;

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(`POST tasks/new/${req.params.id} - 404: institute not found`)
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`POST tasks/new/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) {
            helpers.log_request_error(`POST tasks/new/${req.params.id} - 401: Only institute admins can create tasks`)
            return res.status(401).json({message: "Only institute admins can create tasks"});
        }

        const user = (await helpers.validateUser(req.headers)).data

        const data = new Model.task({
            name: req.body.name,
            author: user._id.toString(),
            institute: institute_id
        })

        const dupe = await repository.get_task_by_name(req.body.name, institute_id);
        if (dupe) {
            helpers.log_request_error(`POST tasks/new/${req.params.id} - 409: Duplicate task`)
            return res.status(409).json({message: `task ${req.body.name} already exists`});
        }

        const dataToSave = await repository.create_new_task(data);

        helpers.log_request_info(`POST tasks/new/${req.params.id} - 201`)
        res.status(201).json(dataToSave);
    } catch (error) {
        helpers.log_request_error(`POST tasks/new/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /tasks/institute/{id}/all:
 *  get:
 *      summary: Gets all tasks for a given institute
 *      description: |
 *           Only institute admins have access.
 *          
 *           Requires a bearer token for authorization.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the institute to retrieve all the tasks from
 * responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: institute not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/institute/:id/all', async (req, res) => {
    try {
        const institute_id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET tasks/institute/${req.params.id}/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, institute_id);
        if (!isAdmin) {
            helpers.log_request_error(`GET tasks/institute/${req.params.id}/all - 401: Only institute admins can view`)
            return res.status(401).json({message: "Only institute admins can view"});
        }

        const institute = await repository.get_institute_by_id(institute_id);
        if (!institute) {
            helpers.log_request_error(`GET tasks/institute/${req.params.id}/all - 404: Institute not found`)
            return res.status(404).json({message: `institute with id ${institute_id} not found`});
        }

        const result = await repository.get_all_institute_tasks(institute_id);

        helpers.log_request_info(`GET tasks/institute/${req.params.id}/all - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET tasks/institute/${req.params.id}/all - 400: ${error.message}`)
        res.status(400).json({message: error.message});   
    }
});

/** 
 * @swagger
 * /tasks/all:
 *  get:
 *      summary: Gets all tasks in the db
 *      description: >
 *           Only the superadmin has access.
 * 
 *           Requires a bearer token for authentication
 * responses:
 *    '200':
 *      description: Ok
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/all', async (req, res) => {
    try {
        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`GET tasks/all - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        if (!user.superadmin) {
            helpers.log_request_error(`GET tasks/all - 401: Unauthorized access. Only superadmin can view`)
            return res.status(401).json({message: 'Unauthorized access. Only superadmin can view'});
        }
        
        const result = await repository.get_all_tasks()

        helpers.log_request_info(`GET tasks/all - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET tasks/all - 400: ${error.message}`)
        res.status(400).json({message: error.message});   
    }
});

/** 
 * @swagger
 * /tasks/one/{id}:
 *  get:
 *      summary: Gets a task by id
 *      description: |
 *          Only collaborators and admins can access.
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to get
 *  responses:
 *    '200':
 *      description: Ok
 *    '404':
 *      description: not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get('/one/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const result = await repository.get_task_data(id, req.headers);

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET tasks/one/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        
        const isMember = await helpers.validateTaskMembers(req.headers, id);
        if (!isMember) {
            helpers.log_request_error(`GET tasks/one/${req.params.id} - 401: Unauthorized access. User not a collaborator`)
            return res.status(401).json({message: `Unauthorized access. User not a collaborator`})
        }
        if (!result) {
            helpers.log_request_error(`GET tasks/one/${req.params.id} - 404: task with id ${id} not found`)
            return res.status(404).json({message: `task with id ${id} not found`});
        }

        helpers.log_request_info(`GET tasks/one/${req.params.id} - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET tasks/one/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});   
    }
});

/** 
 * @swagger
 * /tasks/update/{id}:
 *  patch:
 *      summary: Updates a task
 *      description: |
 *          Use this endpoint to update several fields at one go. It's not recommend you use it for any add/remove operations
 *          Only the institute admin can edit the name of a task
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to update
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/update/:id', async (req, res) => {
        try {
            const id = req.params.id;
            const data = await repository.get_task_by_id(id);

            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
            if (!isAdmin) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 401: Only institute admins can update`)
                return res.status(401).json({message: "Only institute admins can update"});
            }
            
            if (!data) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 404: Task not found`)
                return res.status(404).json({message: `task with id: ${id} not found`});
            }

            const name = req.body.name;
            const dup_name = await repository.get_task_by_name(name, data.institute._id.toString());
            if (dup_name) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 409: Duplicate task name`)
                return res.status(409).json({message: `task with name ${name} already exists`});
            }

            const result = await repository.update_task(id, req.body);

            helpers.log_request_info(`PATCH tasks/update/${req.params.id} - 200`)
            res.status(201).json(result);
        } catch (error) {
            helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /tasks/rename/{id}:
 *  patch:
 *      summary: Renames a task
 *      description: |
 *          Only the institute admin can edit the name of a task
 * 
 *          Requires a bearer token for authentication
 *         ## Schema:
 *         ### name: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to rename
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/rename/:id', 
    validator.check("name").notEmpty().withMessage("name field must be a non-empty string"), 
    async (req, res) => {
        try {
            const errors = validator.validationResult(req);
            if (!errors.isEmpty()) {
                helpers.log_request_error(`PATCH tasks/rename/${req.params.id} - 400: validation errors`)
                return res.status(400).json({ errors: errors.array() });
            }

            const id = req.params.id;
            const data = await repository.get_task_by_id(id);

            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
            if (!isAdmin) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 401: Only institute admins can rename`)
                return res.status(401).json({message: "Only institute admins can rename"});
            }
            
            if (!data) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 404: Task not found`)
                return res.status(404).json({message: `task with id: ${id} not found`});
            }

            const name = req.body.name;
            const dup_name = await repository.get_task_by_name(name, data.institute._id.toString());
            if (dup_name) {
                helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 409: Duplicate task name`)
                return res.status(409).json({message: `task with name ${name} already exists`});
            }

            const result = await repository.edit_task_name(id, name);

            helpers.log_request_info(`PATCH tasks/update/${req.params.id} - 200`)
            res.status(201).json(result);
        } catch (error) {
            helpers.log_request_error(`PATCH tasks/update/${req.params.id} - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /tasks/mark-complete/{id}:
 *  patch:
 *      summary: Marks a task as completed
 *      description: |
 *          Only the institute admin can mark a task as completed
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to mark
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/mark-complete/:id', 
    async (req, res) => {
        try {
            const id = req.params.id;
            const data = await repository.get_task_by_id(id);

            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH tasks/mark-complete/${req.params.id} - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
            if (!isAdmin) {
                helpers.log_request_error(`PATCH tasks/mark-complete/${req.params.id} - 401: Only institute admins can mark`)
                return res.status(401).json({message: "Only institute admins can mark as complete"});
            }
            
            if (!data) {
                helpers.log_request_error(`PATCH tasks/mark-complete/${req.params.id} - 404: Task not found`)
                return res.status(404).json({message: `task with id: ${id} not found`});
            }
            const result = await repository.mark_task_as_completed(id);

            helpers.log_request_info(`PATCH tasks/mark-complete/${req.params.id} - 200`)
            res.status(201).json(result);
        } catch (error) {
            helpers.log_request_error(`PATCH tasks/mark-complete/${req.params.id} - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /tasks/mark-ongoing/{id}:
 *  patch:
 *      summary: Marks a task as ongoing. 
 *      description: |
 *          This is the default status for a task and this route should be used only for converting
 *          a task marked as completed to back to ongoing
 *          Only the institute admin can mark a task as ongoing
 * 
 *          Requires a bearer token for authentication
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to mark
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '400':
 *      description: Bad request
 *    '401':
 *      description: Unauthorized
*/
router.patch('/mark-ongoing/:id', 
    async (req, res) => {
        try {
            const id = req.params.id;
            const data = await repository.get_task_by_id(id);

            if (!req.headers.authorization) {
                helpers.log_request_error(`PATCH tasks/mark-ongoing/${req.params.id} - 401: Token not found`)
                return res.status(401).json({message: "Token not found"});
            }
            const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
            if (!isAdmin) {
                helpers.log_request_error(`PATCH tasks/mark-ongoing/${req.params.id} - 401: Only institute admins can mark`)
                return res.status(401).json({message: "Only institute admins can mark as ongoing"});
            }
            
            if (!data) {
                helpers.log_request_error(`PATCH tasks/mark-ongoing/${req.params.id} - 404: Task not found`)
                return res.status(404).json({message: `task with id: ${id} not found`});
            }
            const result = await repository.mark_task_as_pending(id);

            helpers.log_request_info(`PATCH tasks/mark-ongoing/${req.params.id} - 200`)
            res.status(201).json(result);
        } catch (error) {
            helpers.log_request_error(`PATCH tasks/mark-ongoing/${req.params.id} - 400: ${error.message}`)
            res.status(400).json({message: error.message});
        }
})

/** 
 * @swagger
 * /tasks/add-collabs/{id}:
 *  patch:
 *      summary: Adds collaborators for a given task
 *      description: |
 *         You can add multiple collaborators at one go. Only institude admins have this permission.
 *  
 *         Request will fail with status 404 if usernames supplied are not institute members
 * 
 *         Requires a bearer token for authentication
 *         ## Schema:
 *         ### collaborators: {required: true, type: [String]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to add collaborators for
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch('/add-collabs/:id',  
    validator.check('collaborators').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("collaborators field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }

        const id = req.params.id;
        const data = await repository.get_task_by_id(id);

        if (!req.headers.authorization) {
            helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
        if (!isAdmin) {
            helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 401: Only institute admins can add collaborators`)
            return res.status(401).json({message: "Only institute admins can add collaborators"});
        }
        
        const collab_set = new Set(req.body.collaborators);

        const collaborators = await helpers.validateUserdata(Array.from(collab_set)) 
       
        if (!data) {
            helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 404: Task not found`)
            return res.status(404).json({message: `task with id: ${id} not found`});
        }

        const validMembers = await helpers.validateCollabs(collaborators.data, data.institute._id.toString());
        if (!validMembers) {
            helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 400: Invalid usernames`)
            return res.status(400).json({message: "Invalid institute member username(s) supplied"});
        }

        const result = await repository.add_collaborators(id, collaborators.data);

        helpers.log_request_info(`PATCH tasks/add-collabs/${req.params.id} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /tasks/remove-collabs/{id}:
 *  patch:
 *      summary: Removes collaborators for a given task
 *      description: |
 *         You can remove multiple collaborators at one go. Only institute admins have access.
 * 
 *         Request will fail with status 404 if usernames supplied are not institute members
 * 
 *         Requires a bearer token for authentication.
 *         ## Schema:
 *         ### collaborators: {required: true, type: [String]}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to remove collaborators from
 * responses:
 *    '201':
 *      description: updated
 *    '404':
 *      description: not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch('/remove-collabs/:id',  
    validator.check('collaborators').custom(value => {
        if (!(Array.isArray(value) && value.length > 0)) throw new Error("collaborators field must be a non-empty array");
        return true;
    }), 
    async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH tasks/remove-collabs/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;
        const data = await repository.get_task_by_id(id);

        if (!req.headers.authorization){ 
            helpers.log_request_error(`PATCH tasks/remove-collabs/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
        if (!isAdmin) {
            helpers.log_request_error(`PATCH tasks/remove-collabs/${req.params.id} - 401: Only institute admins can remove collaborators`)
            return res.status(401).json({message: "Only institute admins can remove collaborators"});
        }
        
        const collab_set = new Set(req.body.collaborators);

        const collaborators = await helpers.validateUserdata(Array.from(collab_set)) 
       
        if (!data) {
            helpers.log_request_error(`PATCH tasks/add-collabs/${req.params.id} - 404: Task not found`)
            return res.status(404).json({message: `task with id: ${id} not found`});
        }

        const validMembers = await helpers.validateCollabs(collaborators.data, data.institute._id.toString());
        if (!validMembers) {
            helpers.log_request_error(`PATCH tasks/remove-collabs/${req.params.id} - 400: Invalid usernames`)
            return res.status(400).json({message: "Invalid institute member username(s) supplied"});
        }

        const result = await repository.remove_collaborators(id, collaborators.data);

        helpers.log_request_info(`PATCH tasks/remove-collabs/${req.params.id} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH tasks/remove-collabs/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /tasks/upload-files/{id}:
 *  post:
 *      summary: Uploads a file/files to the server.
 *      description: |
 *          Uploads a file or a group of files. Only admins and collaborators can upload.
 *          ## Schema
 *          Accepts a form-data with the key "files"
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to upload the files to
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.post("/upload-files/:id", upload.array("files"), async (req, res) => {
    try {
        const files = req.files;
        const id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`POST tasks/upload-files/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isMember = await helpers.validateTaskMembers(req.headers, id);
        if (!isMember) {
            helpers.log_request_error(`POST tasks/upload-files/${req.params.id} - 401: User not a collaborator`)
            return res.status(401).json({message: `Unauthorized access. User not a collaborator`})
        }

        if (!files) {
            helpers.log_request_error(`POST tasks/upload-files/${req.params.id} - 400: validation errors`)
            return res.status(400).json({message: "No file selected"});
        }

        const task = await repository.get_task_by_id(id);
        if (!task) {
            helpers.log_request_error(`POST tasks/upload-files/${req.params.id} - 404: Task not found`)
            return res.status(404).json({message: `task ${id} not found`});
        }

       
        let data = []
        
        files.map(p =>
            data.push({
                name: p.filename,
                original_name: p.originalname,
                path: `${FILE_PATH}${p.filename}`,
                parent: id
            })
        )
        const result =  await repository.add_task_file(id, data);

        helpers.log_request_info(`POST tasks/upload-files/${req.params.id} - 200`)
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`POST tasks/upload-files/${req.params.id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /tasks/{task_id}/download-file/{file_id}:
 *  get:
 *      summary: Downloads a file from the server.
 *      description: |
 *        Only admins and collaborators can download files.
 *        
 *        Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: task_id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to download a file from
 *          - in: path
 *            name: file_id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the file to download
 * responses:
 *    '200':
 *      description: Successful
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.get("/:task_id/download-file/:file_id", async (req, res) => {
    
    try {
        const file_id = req.params.file_id;
        const task_id = req.params.task_id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET tasks/download-file/${req.params.id} - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }

        const file = await repository.get_one_task_file(file_id);
        if (!file) {
            helpers.log_request_error(`GET tasks/download-file/${req.params.file_id} - 404: File not found`)
            return res.status(404).json({message: `file ${file_id} not found`});
        }

        const task = await repository.get_task_by_id(task_id);
        if (!task) {
            helpers.log_request_error(`GET tasks/download-file/${req.params.file_id} - 404: Task not found`)
            return res.status(400).json({message: `task with id: ${task_id} not found`});
        }

        const isMember = await helpers.validateTaskMembers(req.headers, task_id);
        if (!isMember) {
            helpers.log_request_error(`GET tasks/download-file/${req.params.file_id} - 401: User not a collaborator`)
            return res.status(401).json({message: `Unauthorized access. User not a collaborator`})
        }
        
        helpers.log_request_info(`GET tasks/download-file/${file_id} - 200`)
        res.download(file.path, file.original_name);
        // res.status(200).json({"file":file.path, "name":file.original_name});
    } catch (error) {
        helpers.log_request_error(`GET tasks/download-file/${file_id} - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
});

/** 
 * @swagger
 * /{id}/comments/new:
 *  post:
 *      summary: Creates a new comment for a given task
 *      description: |
 *          Only admins and collaborators can comment.
 *          
 *          Requires a bearer token for authentication.
 *          ## Schema
 *          ### author: {required: false, type: User}
 *          ### body: {required: true, type: String}
 *          ### task: {default: task_id, type:UUID}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the task to comment on
 * responses:
 *    '201':
 *      description: Created
 *    '401':
 *      description: Unauthorized
 *    '404':
 *      description: institute not found
 *    '400':
 *      description: Bad request
*/
router.post("/:id/comments/new", validator.checkSchema(schemas.newCommentSchema), async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`POST tasks/${req.params.id}/comments/new - 400: Validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`POST tasks/${req.params.id}/comments/new - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isMember = await helpers.validateTaskMembers(req.headers, id);
        if (!isMember) {
            helpers.log_request_error(`POST tasks/${req.params.id}/comments/new - 401: User not a collaborator`)
            return res.status(401).json({message: `Unauthorized access. User not a collaborator`});
        }

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`POST tasks/${req.params.id}/comments/new - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const task = await repository.get_task_by_id(id);
        if (!task) {
            helpers.log_request_error(`POST tasks/${req.params.id}/comments/new - 400: Task not found`)
            return res.status(400).json({message: `task with id: ${id} not found`});
        }

        const data = new Model.comment({
            author: user._id.toString(),
            body: req.body.body, 
            task: id
        });
        const result = await repository.add_task_comment(data);

        helpers.log_request_info(`POST tasks/${req.params.id}/comments/new - 200`)
        res.status(201).json(result);

    } catch (error) {
        helpers.log_request_error(`POST tasks/${req.params.id}/comments/new - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /{id}/comments/all:
 *  get:
 *      summary: Gets all comments for a given task.
 *      description: |
 *          Only admins and collaborators can comment.
 *          
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the task to get comments
 * responses:
 *    '200':
 *      description: Ok
 *    '400':
 *      description: Bad request
*/
router.get("/:id/comments/all", async (req, res) => {
    try {
        const id = req.params.id;

        if (!req.headers.authorization) {
            helpers.log_request_error(`GET tasks/${req.params.id}/comments/all - 401: Token not found`)
            return res.status(401).json({message: "Token not found"});
        }
        const isMember = await helpers.validateTaskMembers(req.headers, id);
        if (!isMember) {
            helpers.log_request_error(`GET tasks/${req.params.id}/comments/all - 401: User not a collaborator`)
            return res.status(401).json({message: `Unauthorized access. User not a collaborator`})
        }

        const task = await repository.get_task_by_id(id);
        if (!task) {
            helpers.log_request_error(`GET tasks/${req.params.id}/comments/all - 404: Task not found`)
            return res.status(404).json({message: `task with id: ${id} not found`});
        }

        const result = await repository.get_task_comments(id);

        helpers.log_request_info(`GET tasks/${req.params.id}/comments/all - 200`)
        res.status(200).json(result);
    } catch (error) {
        helpers.log_request_error(`GET tasks/${req.params.id}/comments/all - 400: ${error.message}`)
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /comments/edit/{id}:
 *  patch:
 *      summary: Edits a comment
 *      description: |
 *          Only the author of a comment can edit.
 *          ## Schema
 *          ### body: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the comment to edit
 * responses:
 *    '201':
 *      description: Ok
 *    '404':
 *      description: Not found
 *    '401':
 *      description: Unauthorized
 *    '400':
 *      description: Bad request
*/
router.patch("/comments/edit/:id", 
        validator.check("body").notEmpty().withMessage("body field must be a non-empty string"), 
        async (req, res) => {
    try {
        const errors = validator.validationResult(req);
        if (!errors.isEmpty()) {
            helpers.log_request_error(`PATCH tasks/comments/edit/${req.params.id} - 400: validation errors`)
            return res.status(400).json({ errors: errors.array() });
        }
        const comment_id = req.params.id;
        const new_body = req.body.body;

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`PATCH tasks/comments/edit/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const comment = await repository.get_comment_by_id(comment_id);
        if (!comment) {
            helpers.log_request_error(`PATCH tasks/comments/edit/${req.params.id} - 401: Comment not found`)
            return res.status(404).json({message: `comment with id ${comment_id} not found`});
        }

        if (comment.author != user._id.toString()){
            helpers.log_request_error(`PATCH tasks/comments/edit/${req.params.id} - 401: Only author can edit`) 
            return res.status(401).json({message: 'Unauthorized access. Only author can edit'});
        }

        const result = await repository.edit_task_comment(comment_id, new_body);

        helpers.log_request_info(`PATCH tasks/comments/edit/${req.params.id} - 201`) 
        res.status(201).json(result);
    } catch (error) {
        helpers.log_request_error(`PATCH tasks/comments/edit/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /comments/delete/{id}:
 *  delete:
 *      summary: Delete a comment
 *      description: |
 *          ## Schema
 *          ### body: {required: true, type: String}
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID
 *            required: true
 *            description: id of the comment to delete
 * responses:
 *    '201':
 *      description: Ok
 *    '404':
 *      description: Not found
 *    '400':
 *      description: Bad request
*/
router.delete("/comments/delete/:id", async (req, res) => {
    try {
        const comment_id = req.params.id;

        const validateUser = await helpers.validateUser(req.headers);
        if (validateUser.status !== 200) {
            helpers.log_request_error(`DELETE tasks/comments/delete/${req.params.id} - ${validateUser.status}: ${validateUser.message}`)
            return res.status(validateUser.status).json({message: validateUser.message});
        }
        const user = validateUser.data;

        const comment = await repository.get_comment_by_id(comment_id);
        if (!comment) {
            helpers.log_request_error(`DELETE tasks/comments/delete/${req.params.id} - 401: Comment not found`)
            return res.status(404).json({message: `comment with id ${comment_id} not found`});
        }

        if (comment.author != user._id.toString()) {
            helpers.log_request_error(`DELETE tasks/comments/delete/${req.params.id} - 401: Only author can delete`) 
            return res.status(401).json({message: 'Unauthorized access. Only author can delete'});
        }

        const result = await repository.delete_task_comment(comment_id);

        helpers.log_request_info(`DELETE tasks/comments/delete/${req.params.id} - 200`) 
        res.status(204).json(result);
    } catch (error) {
        helpers.log_request_error(`DELETE tasks/comments/delete/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
})

/** 
 * @swagger
 * /tasks/delete/{id}:
 *  delete:
 *      summary: Delete a task
 *      description: | 
 *          Deletes a task given an id. Only institute admins can delete tasks.
 * 
 *          Requires a bearer token for authentication.
 *      parameters: 
 *          - in: path
 *            name: id
 *            schema:
 *              type: UUID/Object ID
 *            required: true
 *            description: id of the institute to delete
 *  responses:
 *    '204':
 *      description: deleted
 *    '404':
 *      description: resource/category not found
 *    '400':
 *      description: Bad request
*/
router.delete('/delete/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const data = await repository.get_task_by_id(id);

        if (!data) {
            helpers.log_request_error(`DELETE tasks/delete/${req.params.id} - 404: Task not found`) 
            return res.status(404).json({message: `task with id ${id} not found`});
        }

        if (!req.headers.authorization) {
            helpers.log_request_error(`DELETE tasks/delete/${req.params.id} - 401: Token not found`) 
            return res.status(401).json({message: "Token not found"});
        }
        const isAdmin = await helpers.validateInstituteAdmin(req.headers, data.institute._id.toString());
        if (!isAdmin) {
            helpers.log_request_error(`DELETE tasks/delete/${req.params.id} - 401: Only institute admins can delete tasks`) 
            return res.status(401).json({message: "Only institute admins can delete tasks"});
        }

        const result = await repository.delete_task(id);

        helpers.log_request_info(`DELETE tasks/delete/${req.params.id} - 204`) 
        res.status(204).json({message: `task with id: ${id} deleted successfully`});
    } catch (error) {
        helpers.log_request_error(`DELETE tasks/delete/${req.params.id} - 400: ${error.message}`) 
        res.status(400).json({message: error.message});
    }
})

module.exports = router;