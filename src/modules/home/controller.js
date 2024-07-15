const getUserInfo = require('./../../utils/getUser')
const requestModel = require('./../../models/request')
const getPosts = require('./../../utils/getPosts')

module.exports.homePage = async (req, res, next) => {

    try {
        const user = await getUserInfo.getUserInof(req.user._id)
        const posts = await getPosts.forHome(req.user)
        const requests = await requestModel.find({
            reciever: user._id,
            status: 'waiting for a reply'
        })
            .limit(3).populate('sender', 'username profilePictur')
        res.status(200).render('home', {
            user,
            posts,
            requests
        })
    } catch (err) {
        next(err)
    }
}

module.exports.homeSearch = async (req, res, next) => {

    try {
        const posts = await getPosts.forSearchHome(req.user, req.body.word)
        const requests = await requestModel.find({
            reciever: req.user._id,
            status: 'waiting for a reply'
        })
            .limit(3).populate('sender', 'username profilePictur')
        res.status(200).render('home', {
            user: req.user,
            posts,
            requests
        })
    } catch (err) {
        next(err)
    }
}