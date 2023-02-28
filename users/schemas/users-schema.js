const newUserSchema = {
    username: {
        notEmpty: true,
        errorMessage: "username field cannot be empty"
    },
    email: {
        notEmpty: true,
        errorMessage: "email field cannot be empty and must be a valid email",
        isEmail: {bail: true}
    },
    password: {
        notEmpty: true,
        errorMessage: "password must be at least 5 characters",
        isLength: {min: 5}
    },
}

const updatePasswordSchema = {
    old_password: {
        notEmpty: true,
        errorMessage: "old_password must be at least 5 characters",
        isLength: {min: 5}
    },
    new_password: {
        notEmpty: true,
        errorMessage: "password must be at least 5 characters",
        isLength: {min: 5}
    }
}

const resetPasswordSchema = {
    new_password: {
        notEmpty: true,
        errorMessage: "password must be at least 5 characters",
        isLength: {min: 5}
    },
    token: {
        notEmpty: true,
        errorMessage: "token not provided"
    }
}

const loginSchema = {
    username: {
        notEmpty: true,
        errorMessage: "username field cannot be empty"
    },
    password: {
        notEmpty: true,
        errorMessage: "password must be at least 5 characters",
        isLength: {min: 5}
    }
}

module.exports = {newUserSchema, updatePasswordSchema, resetPasswordSchema, loginSchema};