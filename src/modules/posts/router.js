const express = require('express')
const controller = require('./controller')
const isAuth = require('./../../middlewares/auth')
const isVerified = require('./../../middlewares/isVerifiedAccount')
const { multerStorage } = require('./../../middlewares/uploader')

const router = express.Router()

const uploader = multerStorage(
    'public/images/posts',
    /jpg|png|jpeg|webp|mp4|mkv/
)

router
    .route('/')
    .get(isAuth, isVerified.get, controller.uploadPostPage)
    .post(isAuth, isVerified.post, uploader.single('media'), controller.uploadPost)

router
    .route('/like')
    .post(isAuth, controller.like)

router
    .route('/dislike')
    .post(isAuth, controller.dislike)

router
    .route('/save')
    .post(isAuth, controller.save)

router
    .route('/unsave')
    .post(isAuth, controller.unsave)

router
    .route('/saves')
    .get(isAuth, controller.saves)

router
    .route('/:postID/remove')
    .post(isAuth, controller.remove)

router
    .route('/new-comment')
    .post(isAuth, controller.addComment)

module.exports = router
