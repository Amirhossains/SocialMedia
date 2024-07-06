const express = require('express')
const controller = require('./controller')

const router = express.Router()

router
    .route('/register')
    .get(controller.registerPage)
    .post(controller.register)

router
    .route('/login')
    .get(controller.loginPage)
    .post(controller.login)

router
    .route('/refresh-token/:path/?:path2')
    .get(controller.refreshToken)

router
    .route('/forget-password')
    .get(controller.forgetPasswordPage)
    .post(controller.forgetPassword)

router
    .route('/reset-password/:token')
    .get(controller.resetPasswordPage)

router
    .route('/reset-password')
    .post(controller.resetPassword)

module.exports = router
