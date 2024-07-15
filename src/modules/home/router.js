const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')
const router = express.Router()

router
    .route('/')
    .get(isAuth.get, controller.homePage)

router
    .route('/search')
    .post(isAuth.post, controller.homeSearch)

module.exports = router
