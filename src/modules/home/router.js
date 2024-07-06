const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')
const router = express.Router()

router
    .route('/')
    .get(isAuth, controller.homePage)

module.exports = router
