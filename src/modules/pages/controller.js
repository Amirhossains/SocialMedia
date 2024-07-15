const hasAccessToPage = require('./../../utils/hasAccessToPage')
const followModel = require('./../../models/follows')
const userModel = require('./../../models/User')
const requestModel = require('./../../models/request')
const getPosts = require('./../../utils/getPosts')

module.exports.userPage = async (req, res, next) => {

    try {
        let hasAccess = true
        const isOwn = req.params.profileID === req.user._id.toString()
        if (!isOwn) {
            hasAccess = await hasAccessToPage(req.user._id, req.params.profileID)
        }

        const isFollowed = await followModel.findOne({
            follower: req.user._id,
            following: req.params.profileID
        }).lean()

        const request = await requestModel.findOne({
            sender: req.user._id,
            reciever: req.params.profileID
        })

        const page = await userModel.findById(req.params.profileID,
            'fullname username private biography isVerified profilePicture').lean()
        if (!hasAccess) {
            return res.status(200).render('pages/profile', {
                followed: Boolean(isFollowed),
                pageID: req.params.profileID,
                followers: [],
                followings: [],
                page,
                hasAccess,
                posts: [],
                isOwn,
                request
            })
        }

        let followers = await followModel.find({ following: req.params.profileID }).populate(
            'follower',
            'fullname username profilePicture'
        ).lean()

        followers = followers.map((item) => item.follower)
        let followings = await followModel.find({ follower: req.params.profileID }).populate(
            'following',
            'fullname username profilePicture'
        ).lean()
        followings = followings.map((item) => item.following)

        const posts = await getPosts.userPage(req.user._id, req.params.profileID)
        return res.status(200).render('pages/profile', {
            followed: Boolean(isFollowed),
            pageID: req.params.profileID,
            followers,
            followings,
            page,
            hasAccess,
            posts,
            isOwn,
            request
        })
    } catch (err) {
        next(err)
    }
}

module.exports.unfollow = async (req, res, next) => {

    try {
        const user = req.user
        const { profileID } = req.params
        const page = await userModel.findById(profileID).lean()
        if (!page) {
            req.flash('error', "Page not found !!")
            return res.status(404).redirect(`/pages/${profileID}`)
        }

        if (user._id.toString() === profileID) {
            req.flash('error', "You can not unfollow your own page !!")
            return res.status(404).redirect(`/pages/${profileID}`)
        }

        const isFollowed = await followModel.findOneAndDelete({
            follower: user._id,
            following: profileID
        })
        if (!isFollowed) {
            req.flash('error', "You did not follow this page !!")
            return res.status(404).redirect(`/pages/${profileID}`)
        }

        await requestModel.findOneAndDelete({
            sender: user._id,
            reciever: profileID
        }).lean()
        req.flash('success', "You unfollowed successfully :))")
        return res.status(200).redirect(`/pages/${profileID}`)
    } catch (err) {
        next(err)
    }
}

module.exports.follow = async (req, res, next) => {

    try {
        const user = req.user
        const { profileID } = req.params
        const page = await userModel.findById(profileID).lean()
        if (!page) {
            req.flash('error', "Page not found !!")
            return res.status(404).redirect(`/pages/${profileID}`)
        }

        if (profileID === user._id.toString()) {
            req.flash('error', "You can not follow yourself !!")
            return res.status(400).redirect(`/pages/${profileID}`)
        }

        if (page.private === true) {
            req.flash('error', "You must send request to follow !!")
            return res.status(403).redirect('back')
        }

        const isFollowed = await followModel.findOne({
            follower: user._id,
            following: profileID
        })
        if (isFollowed) {
            req.flash('error', "You already followed this page !!")
            return res.status(409).redirect(`/pages/${profileID}`)
        }

        let follow = new followModel({
            follower: user._id,
            following: profileID
        })
        await follow.save()

        req.flash('success', "You followed the page successfully :))")
        return res.status(200).redirect(`/pages/${profileID}`)
    } catch (err) {
        next(err)
    }
}
