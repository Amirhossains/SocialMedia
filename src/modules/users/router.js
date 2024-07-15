const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')
const { multerStorage } = require('./../../middlewares/uploader')
const router = express.Router()

router
    .route('/edit-profile')
    .get(isAuth.get, controller.editPage)
    .post(isAuth.post, multerStorage('public/images/profiles').single('profilePicture'), controller.edit)

module.exports = router
