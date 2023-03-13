const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const resourceFileSchema =  new mongoose.Schema({
    original_name: { required: true, type: String },
    name: { required: true, type: String },
    path: { required: true, type: String },
    parent: { required: true, type: Schema.Types.ObjectId, ref: "resources" },
    date_created: {type: Date, default: Date.now} 
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
    }
});

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
    }
})

const resource = mongoose.model('Resource', resourceSchema);
const category = mongoose.model("Category", categorySchema);
const resourceFile = mongoose.model("resourcefile", resourceFileSchema);
const rating = mongoose.model("rating", ratingSchema);

module.exports = { resource, category, resourceFile, rating }