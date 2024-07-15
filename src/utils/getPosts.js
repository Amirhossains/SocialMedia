const saveModel = require('./../models/save')
const likeModel = require('./../models/likes')
const followModel = require('./../models/follows')
const postModel = require('./../models/post')

module.exports.forHome = async (user) => {

    const allPosts = await postModel.find({})
        .sort({ _id: -1 })
        .populate('user', '_id username fullname profilePicture private')

    const userSaves = await saveModel.find({ user: user._id }).lean()
    const userLikes = await likeModel.find({ user: user._id }).lean()
    const posts = []
    allPosts.forEach(post => {
        if (posts.length <= 3) {
            if (!post.user.private) {
                if (post.user._id.toString() !== user._id.toString()) {
                    userSaves.forEach(save => {
                        if (save.post.toString() === post._id.toString()) {
                            post.isSaved = true
                        }
                    })
                    userLikes.forEach(like => {
                        if (like.post.toString() === post._id.toString()) {
                            post.isLiked = true
                        }
                    })
                    posts.push(post)
                }
            }
        }
    })
    const friends = await followModel.find({ follower: user._id }).sort({ _id: -1 })
        .populate('following', '_id username profilePicture')

    await Promise.all(posts.map(async (post) => {
        let friendsLikes = []
        let allLikes = await likeModel.find({ post: post._id })
        post.allLikes = allLikes.length
        friends.forEach(friend => {
            allLikes.forEach(like => {
                if (friend.following._id.toString() === like.user._id.toString() && friendsLikes.length < 3) {
                    friendsLikes.push(friend.following)
                }
            })
            post.friendsLikes = friendsLikes
        })
    }))
    return posts
}

module.exports.forSearchHome = async (user, word) => {

    const allPosts = await postModel.find({
        hashtags: { $in: word }
    })
        .sort({ _id: -1 })
        .populate('user', '_id username fullname profilePicture private')

    const userSaves = await saveModel.find({ user: user._id }).lean()
    const userLikes = await likeModel.find({ user: user._id }).lean()
    const posts = []
    allPosts.forEach(post => {
        if (posts.length <= 3) {
            if (!post.user.private) {
                if (post.user._id.toString() !== user._id.toString()) {
                    userSaves.forEach(save => {
                        if (save.post.toString() === post._id.toString()) {
                            post.isSaved = true
                        }
                    })
                    userLikes.forEach(like => {
                        if (like.post.toString() === post._id.toString()) {
                            post.isLiked = true
                        }
                    })
                    posts.push(post)
                }
            }
        }
    })
    const friends = await followModel.find({ follower: user._id }).sort({ _id: -1 })
        .populate('following', '_id username profilePicture')

    await Promise.all(posts.map(async (post) => {
        let friendsLikes = []
        let allLikes = await likeModel.find({ post: post._id })
        post.allLikes = allLikes.length
        friends.forEach(friend => {
            allLikes.forEach(like => {
                if (friend.following._id.toString() === like.user._id.toString() && friendsLikes.length < 3) {
                    friendsLikes.push(friend.following)
                }
            })
            post.friendsLikes = friendsLikes
        })
    }))
    return posts
}

module.exports.userPage = async (user, pageID) => {

    const posts = await postModel.find({ user: pageID })
        .sort({ _id: -1 })
        .populate('user', '_id username fullname profilePicture private')

    const userSaves = await saveModel.find({ user: user._id }).lean()
    const userLikes = await likeModel.find({ user: user._id }).lean()
    posts.forEach(post => {
        userSaves.forEach(save => {
            if (save.post.toString() === post._id.toString()) {
                post.saved = true
            }
        })
        userLikes.forEach(like => {
            if (like.post.toString() === post._id.toString()) {
                post.liked = true
            }
        })
    })
    const friends = await followModel.find({ follower: user._id }).sort({ _id: -1 })
        .populate('following', '_id username profilePicture')

    await Promise.all(posts.map(async (post) => {
        let friendsLikes = []
        let allLikes = await likeModel.find({ post: post._id })
        post.allLikes = allLikes.length
        friends.forEach(friend => {
            allLikes.forEach(like => {
                if (friend.following._id.toString() === like.user._id.toString() && friendsLikes.length < 3) {
                    friendsLikes.push(friend.following)
                }
            })
            post.friendsLikes = friendsLikes
        })
    }))
    return posts
}

module.exports.forSaves = async (user) => {
    const allPosts = await saveModel.find({ user: user._id }).populate({
        path: 'post',
        populate: {
            path: 'user'
        }
    }).sort({ _id: -1 }).lean()
    const userLikes = await likeModel.find({ user: user._id }).populate('post', '_id').lean()
    const friends = await followModel.find({ follower: user._id }).sort({ _id: -1 })
        .populate('following', '_id username profilePicture')

    const posts = []
    const follows = await followModel.find({ follower: user._id }).lean()
    allPosts.forEach(post => {
        if (!post.post.user.private) {
            posts.push(post)
        } else {
            follows.forEach(follow => {
                if (post.post.user._id.toString() === follow.following.toString()) {
                    posts.push(post)
                }
            })
        }
    })
    await Promise.all(posts.map(async (post) => {
        let friendsLikes = []
        let allLikes = await likeModel.find({ post: post.post._id })
        post.allLikes = allLikes.length
        friends.forEach(friend => {
            allLikes.forEach(like => {
                if (friend.following._id.toString() === like.user._id.toString() && friendsLikes.length < 3) {
                    friendsLikes.push(friend.following)
                }
            })
            post.friendsLikes = friendsLikes
        })
        userLikes.forEach(like => {
            if (like.post._id.toString() === post.post._id.toString()) {
                post.hasLike = true
            }
        })
    }))
    return posts
}