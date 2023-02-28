const newInstituteSchema = {
    name: {
        notEmpty: true,
        errorMessage: 'Name field cannot be empty',
    },

}

const pubResourceSchema = {
    resource_id: {
        notEmpty: true,
        errorMessage: "a resource id must be supplied"
    },
    institute_id: {
        notEmpty: true,
        errorMessage: "an institute id must be supplied"
    }
}

module.exports = { newInstituteSchema, pubResourceSchema }