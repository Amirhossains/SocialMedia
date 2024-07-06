const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')

const router = express.Router()

router
    .route('/:profileID')
    .get(isAuth, controller.userPage)

router
    .route('/:profileID/follow')
    .post(isAuth, controller.follow)

router
    .route('/:profileID/unfollow')
    .post(isAuth, controller.unfollow)

module.exports = router
