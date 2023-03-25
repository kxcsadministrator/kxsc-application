/*---------------------------------------- models.js ------------------------------------*/
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/*------------------------------------- file schemas ------------------------------------*/
const taskFileSchema =  new mongoose.Schema({
    original_name: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    parent: { required: true, type: Schema.Types.ObjectId, ref: "Task" },
    date_created: {type: Date, default: Date.now} 
});

// same schema as above, but for organization files
const instituteFileSchema =  new mongoose.Schema({
    original_name: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    parent: { required: true, type: Schema.Types.ObjectId, ref: "ResearchInstitute" },
    date_created: {type: Date, default: Date.now} 
});

/*-------------------------------- comment schema ---------------------------------------*/
const commentSchema = new mongoose.Schema({
    author: { type: String, required: true},
    body: { type: String, required: true },
    task: { type: Schema.Types.ObjectId, ref: "Task", required: true },
    date_created: {type: Date, default: Date.now}
});

/*------------------------------------- tasks schema ------------------------------------*/
const taskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    institute: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "ResearchInstitute"
    },
    collaborators: { // refactor when users service is implemented
        type: [String],
        // validate: v => Array.isArray(v) && v.length > 0
    },
    status: {
        type: String,
        default: "pending"
    },
    date_created: {
        type: Date, 
        default: Date.now
    },
    comments: [{
        type: Schema.Types.ObjectId,
        ref: "Comment",
    }],
    files: [{ 
        type: Schema.Types.ObjectId,
        ref: "TaskFile"
    }]
})

/*------------------------------------- organizations/research institute schema ----------------------------*/
const instituteSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    admins: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "task"
    }],
    members: { // modify when users service is up
        type: [String],
        required: false
    },
    resources: [{
        type: Schema.Types.ObjectId,
        ref: "resources"
    }],
    date_created: {
        type: Date, 
        default: Date.now
    },
    files: [{
        type: Schema.Types.ObjectId,
        ref: "instituteFile"
    }]
})

/*------------------------------------- publication request schema ----------------------------*/
const publicationRequestSchema = new mongoose.Schema({
    resource: {
        type: Schema.Types.ObjectId,
        ref: "resources",
        required: true
    },
    institute: {
        type: Schema.Types.ObjectId,
        ref: "researchinstitutes",
        required: true
    }
})

/* ---------------------------------- Resource Schema ---------------------------------- */
const resourceSchema = new mongoose.Schema({
    topic: {
        required: true,
        type: String
    },

    description: {
        type: String
    },

    author: {
        // validate: v => Array.isArray(v) && v.length > 0,
        type: String,
        required: true
    },

    institute: {
        type: Schema.Types.ObjectId,
        ref: "researchinstitutes",
        required: true
    },

    category: {
        required: true,
        type: String
    },

    sub_categories: {
        validate: v => Array.isArray(v) && v.length > 0,
        type: [String]
    },

    visibility: {
        type: String,
        default: "private"
    },

    resource_type: {
        required: true,
        type: String
    },

    citations: {
        type: [String],
        validate: v => Array.isArray(v) && v.length > 0
    },

    date: {
        type: Date,
        default: Date.now
    },

    rating: {
        type: Number,
        default: 0
    },

    files: {
        required: false,
        type: [String]
    },

    avatar: {
        type: String,
        required: false
    }
});

const resourceFileSchema =  new mongoose.Schema({
    original_name: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    parent: { required: true, type: Schema.Types.ObjectId, ref: "resources" },
    date_created: {type: Date, default: Date.now} 
});

const taskFile = mongoose.model("TaskFile", taskFileSchema);
const instituteFile = mongoose.model("instituteFile",  instituteFileSchema);
const comment = mongoose.model("Comment", commentSchema);
const task = mongoose.model("Task", taskSchema);
const institute = mongoose.model("ResearchInstitute", instituteSchema);
const pubRequest = mongoose.model("InstitutePublishRequest", publicationRequestSchema)
// --------------- Only needed for deletions ------------------------
const resource = mongoose.model('Resource', resourceSchema);
const resourceFile = mongoose.model("resourcefile", resourceFileSchema);

module.exports = { taskFile, instituteFile, comment, task, institute, pubRequest, resource, resourceFile};