const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')

const router = express.Router()

router
    .route('/:profileID')
    .get(isAuth.get, controller.userPage)

router
    .route('/:profileID/follow')
    .post(isAuth.post, controller.follow)

router
    .route('/:profileID/unfollow')
    .post(isAuth.post, controller.unfollow)

module.exports = router
