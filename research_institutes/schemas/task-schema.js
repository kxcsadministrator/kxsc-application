const newTaskSchema = {
    name: {
        notEmpty: true,
        errorMessage: 'name field cannot be empty',
    }
}

const newCommentSchema = {
    body: {
        notEmpty: true,
        errorMessage: 'body field cannot be empty',
    },
}

module.exports = {newTaskSchema, newCommentSchema}