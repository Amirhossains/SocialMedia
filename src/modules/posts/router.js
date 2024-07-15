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
    .get(isAuth.get, controller.uploadPostPage)
    .post(isAuth.post, isVerified.post, uploader.single('media'), controller.uploadPost)

router
    .route('/like')
    .post(isAuth.post, controller.like)

router
    .route('/dislike')
    .post(isAuth.post, controller.dislike)

router
    .route('/save')
    .post(isAuth.post, controller.save)

router
    .route('/unsave')
    .post(isAuth.post, controller.unsave)

router
    .route('/saves')
    .get(isAuth.get, controller.saves)

router
    .route('/:postID/remove')
    .post(isAuth.post, controller.remove)

router
    .route('/new-comment')
    .post(isAuth.post, controller.addComment)

module.exports = router
