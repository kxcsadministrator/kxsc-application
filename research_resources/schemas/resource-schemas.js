const newResourceSchema = {
    topic: {
        notEmpty: true,
        errorMessage: "topic must be at least 2 characters",
    },
    category: {
        notEmpty: true,
        errorMessage: "category must be a name",
    },
    sub_categories: {
        custom: {
            options: (value) => {
                return (Array.isArray(value) && value.length > 0) 
            }
        },
        errorMessage: "sub_categories field must be a non-empty array"
    },
    institute: {
        notEmpty: true,
        errorMessage: "institute must be at an ID",
    },
    resource_type: {
        notEmpty: true,
        errorMessage: "resource_type must be valid",
    },

}

const newRatingSchema = {
    id: {
        notEmpty: true,
        errorMessage: "a resource id must be supplied"
    },
    value: {
        custom: {
            options: (value) => {
                return (value >= 1 && value <= 5)
            } 
        },
        errorMessage: "value must be between 1 and 5"
    }
}

module.exports = {newResourceSchema, newRatingSchema};