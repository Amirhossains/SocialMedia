const express = require('express')
const isAuth = require('./../../middlewares/auth')
const controller = require('./controller')

const router = express.Router()

router
    .route('/accept')
    .post(isAuth.post, controller.accept)

router
    .route('/reject')
    .post(isAuth.post, controller.reject)

router
    .route('/:pageID/send')
    .post(isAuth.post, controller.send)

router
    .route('/:pageID/unsend')
    .post(isAuth.post, controller.unsend)

module.exports = router
