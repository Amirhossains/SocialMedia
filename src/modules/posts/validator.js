const yup = require('yup')

module.exports.uploadPotsValidation = yup.object({
    description: yup
        .string()
        .max(2200, "Description can not be more that 2200 chars!")
        .required("Description is required!")
})
