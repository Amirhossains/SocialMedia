const jwt = require('jsonwebtoken')
const userModel = require('./../models/User')

module.exports.get = async (req, res, next) => {

    try {
        const token = req.cookies['access-token']
        if (token === undefined) {
            req.flash('error', "Please login first")
            return res.status(401).redirect('/auth/login')
        }

        try {
            const payload = jwt.verify(token, 'de25df8c62ve2cveuif2fe2')
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
            if (req._parsedOriginalUrl.pathname === '/') {
                return res.status(401).redirect('/auth/refresh-token/n')
            } else {
                return res.status(401).redirect(`/auth/refresh-token${req._parsedOriginalUrl.pathname}`)
            }
        }
    } catch (err) {
        next(err)
    }
}

module.exports.post = async (req, res, next) => {

    try {
        const refreshToken = req.cookies['refresh-token']
        if (refreshToken === undefined) {
            req.flash('error', "Please login first")
            return res.status(401).redirect('/auth/login')
        }

        try {
            const token = req.cookies['access-token']
            const payload = jwt.decode(token, 'de25df8c62ve2cveuif2fe2')
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
            req.flash('error', "You must login again!!")
            return res.status(400).redirect('/auth/login')
        }

    } catch (err) {
        next(err)
    }
}