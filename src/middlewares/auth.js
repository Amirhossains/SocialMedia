const jwt = require('jsonwebtoken')
const url = require('url')
const userModel = require('./../models/User')

module.exports = async (req, res, next) => {

    try {
        const token = req.cookies['access-token']
        if (token === undefined) {
            req.flash('error', "Please login first")
            return res.status(401).redirect('/auth/login')
        }

        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY)
            if (!payload) {
                req.flash('error', "You must login again")
                return res.status(400).redirect('/auth/login')
            }
            const user = await userModel.findById(payload.userID).lean()
            if (!user) {
                req.flash('error', "Please login first")
                return res.status(401).redirect('/auth/login')
            }
            Reflect.deleteProperty(user, 'password')
            req.user = user
            next()
        } catch (error) {
            return res.status(401).redirect(`/auth/refresh-token${req._parsedOriginalUrl.pathname}`)
        }
    } catch (err) {
        next(err)
    }
}