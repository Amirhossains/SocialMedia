const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')
const { multerStorage } = require('./../../middlewares/uploader')
const router = express.Router()

router
    .route('/edit')
    .get(isAuth, controller.editPage)
    .post(isAuth, multerStorage('public/images/profiles').single('profilePicture'), controller.edit)

module.exports = router
