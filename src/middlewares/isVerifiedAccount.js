
module.exports.post = async (req, res, next) => {

    try {
        if (!req.user.isVerified) {
            req.flash('error', "You must be verified at first!!")
            return res.status(403).redirect('/posts')
        }
        next()
    } catch (err) {
        next(err)
    }
}

