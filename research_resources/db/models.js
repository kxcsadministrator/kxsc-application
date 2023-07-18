const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceFileSchema =  new mongoose.Schema({
    original_name: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    parent: { required: true, type: Schema.Types.ObjectId, ref: "resources" },
    date_created: {type: Date, default: Date.now}, 
});

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
    },
    view_count : {
        type: Number,
        default: 0,
        required: true
    }
});


/* ---------------------- Category Schema --------------------------- */
const categorySchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    sub_categories: {
        required: true,
        type: [String]
    },
    date: {
        type: Date,
        default: Date.now
    },
});

// --------------------------------- Rating ----------------------------------------
const ratingSchema = new mongoose.Schema({
    resource: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "resource"

    },
    author: {
        type: String,
        required: true
    },
    score: {
        type: Number,
        min: 1,
        max: 5
    },
    review: {
        type: String,
        required: false
    },
    date_created: {type: Date, default: Date.now}
})

// --------------------------------- Likes ----------------------------------------
const likeSchema = new mongoose.Schema({
    resource: {
        required: true,
        type: Schema.Types.ObjectId,
        ref: "resource"

    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    },
    date_created: {type: Date, default: Date.now}
})

// --------------------------------- Resource Type ----------------------------------------
const resourceTypeSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    }
});



// --------------------------------- User ----------------------------------------
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


const resource = mongoose.model('Resource', resourceSchema);
const category = mongoose.model("Category", categorySchema);
const resourceFile = mongoose.model("resourcefile", resourceFileSchema);
const rating = mongoose.model("rating", ratingSchema);
const resourceType = mongoose.model("resourcetype", resourceTypeSchema);
const resourceLikes = mongoose.model("resourcelikes", likeSchema);

const user = mongoose.model("user", userSchema);
const institute = mongoose.model("ResearchInstitute", instituteSchema);

module.exports = { resource, category, resourceFile, rating, user, institute, resourceType, resourceLikes }