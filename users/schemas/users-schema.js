const newUserSchema = {
    username: {
        custom: {
            options: (value) => {
                if (value == undefined) return false
                return (value.length > 2) 
            }
        },
        errorMessage: "username must be at least two characters"
    },
    first_name: {
        custom: {
            options: (value) => {
                if (value == undefined) return false
                return (value.length > 2) 
            }
        },
        errorMessage: "first name must be at least two characters"
    },
    last_name: {
        custom: {
            options: (value) => {
                if (value == undefined) return false
                return (value.length > 2) 
            }
        },
        errorMessage: "last name must be at least two characters"
    },
    phone: {
        notEmpty: true,
        errorMessage: "please enter your phone number"
    },
    country: {
        notEmpty: true,
        errorMessage: "please enter your country of residence"
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