const getUserInfo = require('./../../utils/getUser')

module.exports.homePage = async (req, res, next) => {

    try {
        const user = await getUserInfo.getUserInof(req.user._id)

        res.status(200).render('home', {
            user
        })
    } catch (err) {
        next(err)
    }
}