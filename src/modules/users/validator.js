const yup = require('yup')

module.exports.editValidation = yup.object({
    email: yup
        .string()
        .required("Email is required")
        .email("Email is not valid"),
    username: yup
        .string()
        .required("Username is required")
        .min(3, "Username must be 3 chars at least")
        .max(24, "Username must be 24 chars at top"),
    fullname: yup
        .string()
        .required("Fullname is required")
        .min(5, "fullname must be 5 chars ar least")
        .max(34, "fullname must be 34 chars ar top")
})

module.exports.loginValidation = yup.object({
    username: yup
        .string().required("Username is required"),
    password: yup
        .string().required("password is required")
})
