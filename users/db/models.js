/*---------------------------------------- models.js ------------------------------------*/
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

/* --------------------------------------- Profile picture Schema ------------------------------------- */
const picSchema = new mongoose.Schema({
    original_name: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    user: { required: true, type: Schema.Types.ObjectId, ref: "User" },
    date_created: {type: Date, default: Date.now} 
})


/* --------------------------------------- User Schema ------------------------------------- */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email : {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    profile_picture: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "profilePicture"
    },
    superadmin: {
        type: Boolean,
        default: false
    },
    institutes: [{
        type: Schema.Types.ObjectId,
        ref: "researchinstitutes"
    }],
    resources: [{
        type: Schema.Types.ObjectId,
        ref: "resources"
    }],
    tasks: [{
        type: Schema.Types.ObjectId,
        ref: "tasks"
    }],
    date_created: {type: Date, default: Date.now} 
})
userSchema.plugin(mongoosePaginate)

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

/* ---------------------------------- Token Schema ---------------------------------- */
const tokenSchema = new mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    token: {
        type: String,
        required: true,
    },
    date_created: {
        type: Date,
        default: Date.now,
        expires: 3600,// this is the expiry time in seconds
    }
})

/* ---------------------- Resource Schema --------------------------- */
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


/* ---------------------------------- Message Schema ---------------------------------- */
const messageSchema = new mongoose.Schema({
    sender: {
        type: Schema.Types.ObjectId,
        required: false,
        ref: "user",
    },
    recipients: [{
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    }],
    body: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
})

/* ---------------------------------- Notification Schema ---------------------------------- */
const notificationSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "user",
    },
    date_created: {
        type: Date,
        default: Date.now,
    }
})

const profilePic = mongoose.model("profilePicture", picSchema);
const user = mongoose.model("user", userSchema);
const token = mongoose.model("token", tokenSchema);
const pubRequest = mongoose.model("AdminPublishRequest", publicationRequestSchema)
const resource = mongoose.model('Resource', resourceSchema);
const institute = mongoose.model("ResearchInstitute", instituteSchema);
const task = mongoose.model("Task", taskSchema);
const message = mongoose.model("Message", messageSchema)
const notification = mongoose.model("Notification", notificationSchema)

module.exports = { profilePic, user, token, pubRequest, resource, institute, task, message, notification};