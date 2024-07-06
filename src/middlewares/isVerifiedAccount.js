

module.exports.get = async (req, res, next) => {

    try {
        if (!req.user.isVerified) {
            req.flash('isVerified', "true")
            return res.status(200).render('posts/upload')
        }
        next()
    } catch (err) {
        next(err)
    }
}

module.exports.post = async (req, res, next) => {

    try {
        if (!req.user.isVerified) {
            req.flash('error', "You must be verified at first!!")
            return res.status(403).render('posts/upload')
        }
        next()
    } catch (err) {
        next(err)
    }
}

