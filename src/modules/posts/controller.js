const validator = require('./validator')
const hasAccessToPage = require('./../../utils/hasAccessToPage')
const path = require('path')
const fs = require('fs')
const postModel = require('./../../models/post')
const likeModel = require('./../../models/likes')
const saveModel = require('./../../models/save')
const commentModel = require('./../../models/comment')

module.exports.uploadPostPage = async (req, res) => {

    res.status(200).render('posts/upload', {
        profilePicture: req.user.profilePicture
    })
}

module.exports.uploadPost = async (req, res, next) => {

    try {
        await validator.uploadPotsValidation.validate(req.body)

        const { description, hashtags } = req.body
        const tags = hashtags.split(',')

        if (!req.file) {
            req.flash('error', "Media is required!!")
            return res.status(400).redirect('/posts')
        }

        let post = new postModel({
            media: {
                path: `images/posts/${req.file.filename}`,
                filename: req.file.filename
            },
            description,
            hashtags: tags,
            user: req.user._id
        })
        await post.save()

        req.flash('success', "Post uploaded successfully :))")
        return res.status(201).redirect('/posts')
    } catch (err) {
        next(err)
    }
}

module.exports.like = async (req, res, next) => {

    try {
        const { postID } = req.body
        const user = req.user

        const post = await postModel.findById(postID).lean()
        if (!post) {
            req.flash('error', "The post does not exist !!")
            return res.status(404).redirect('back')
        }

        const hasAccess = await hasAccessToPage(user._id, post.user.toString())
        if (!hasAccess) {
            req.flash('error', "You do not have access !!")
            return res.status(403).redirect('back')
        }

        const isLiked = await likeModel.findOne({ user: user._id, post: postID })
        if (isLiked) {
            req.flash('error', "You already liked this post !!")
            return res.status(409).redirect('back')
        }

        let like = new likeModel({
            user: user._id,
            post: postID
        })
        await like.save()
        return res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.dislike = async (req, res, next) => {

    try {
        const user = req.user
        const { postID } = req.body

        const likedPost = await likeModel.findOneAndDelete({
            user: user._id,
            post: postID
        })
        if (!likedPost) {
            req.flash('error', "You have not liked this post !!")
            return res.status(404).redirect('back')
        }
        return res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.save = async (req, res, next) => {

    try {
        const user = req.user
        const { postID } = req.body

        const post = await postModel.findById(postID)
        if (!post) {
            req.flash('error', "This post does not exist !!")
            return res.status(404).redirect('back')
        }

        const hasAccess = hasAccessToPage(user._id, post.user)
        if (!hasAccess) {
            req.flash('error', "You do not have access !!")
            return res.status(403) / redirect('back')
        }

        const isSaved = await saveModel.findOne({
            user: user._id,
            post: postID
        })
        if (isSaved) {
            req.flash('error', "You already saved this post !!")
            return res.status(409).redirect('back')
        }

        const savedPost = new saveModel({
            user: user._id,
            post: postID
        })
        await savedPost.save()
        return res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.unsave = async (req, res, next) => {

    try {
        const user = req.user
        const { postID } = req.body

        const savedPost = await saveModel.findOneAndDelete({
            user: user._id,
            post: postID
        })
        if (!savedPost) {
            req.flash('error', "You have not saved this post !!")
            return res.status(404).redirect('back')
        }
        return res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.saves = async (req, res, next) => {

    try {
        const user = req.user
        const saves = await saveModel.find({ user: user._id }).populate({
            path: 'post',
            populate: {
                path: 'user',
            }
        }).lean()

        const likes = await likeModel.find({ user: user._id }).populate('post').lean()

        saves.forEach(item => {
            likes.forEach(like => {
                if (item.post._id.toString() === like.post._id.toString()) {
                    item.hasLike = true
                }
            })
        })
        return res.status(200).render('posts/saves', {
            posts: saves,
            user: req.user

        })
    } catch (err) {
        next(err)
    }
}

module.exports.remove = async (req, res, next) => {

    try {
        const user = req.user
        const { postID } = req.params

        const post = await postModel.findById(postID).lean()
        if (user._id.toString() !== post.user.toString()) {
            req.flash('error', "You can not delete this post !!")
            return res.status(400).redirect('back')
        }

        const mediaPath = path.join(__dirname, '..', '..', '..', 'public', 'images', 'posts', post.media.filename)
        fs.unlinkSync(mediaPath, (err) => {
            if (err) {
                next(err)
            }
        })
        await likeModel.deleteMany({ post: postID })
        await saveModel.deleteMany({ post: postID })
        await commentModel.deleteMany({ post: postID })
        await postModel.findByIdAndDelete(postID)

        req.flash('success', "Post deleted successfully :))")
        return res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.addComment = async (req, res, next) => {

    try {
        const user = req.user
        const { postID, content } = req.body
        const post = await postModel.findById(postID).lean()
        if (!post) {
            req.flash('error', "Post not found !!")
            return res.status(404).redirect('back')
        }

        const comment = new commentModel({
            post: postID,
            user: user._id,
            content
        })
        await comment.save()

        req.flash('success', "Comment submited successfyully :))")
        return res.status(201).redirect('back')

    } catch (err) {
        next(err)
    }
}