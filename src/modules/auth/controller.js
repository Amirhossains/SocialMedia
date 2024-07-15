const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const bcryptjs = require('bcryptjs')
const nodeMailer = require('nodemailer')
const { errorResponse, successResponse } = require('../../utils/responses')
const refreshTokenModel = require('./../../models/refreshToken')
const userModel = require('./../../models/User')
const resetPasswordModel = require('./../../models/resetPassword')
const validator = require('./validator')

module.exports.registerPage = async (req, res, next) => {

    try {
        res.status(200).render('auth/register')
    } catch (err) {
        next(err)
    }
}

module.exports.register = async (req, res, next) => {

    try {
        const { email, username, fullname, password } = req.body
        try {
            await validator.registerationValidation.validate(req.body, { abortEarly: false })
        } catch (err) {
            req.flash('error', err.errors[0])
            return res.status(400).redirect('/auth/register')
        }
        const isExistUser = await userModel.findOne({
            $or: [{ username }, { email }]
        })
        if (isExistUser) {
            req.flash('error', "Email or username already exists!")
            return res.status(409).redirect('/auth/register')

            // return errorResponse(res, 409, "Email or username already exists!")
        }

        if (req.body.isPublic) {
            req.body.isPrivate = false
        } else {
            req.body.isPrivate = true
        }
        const isFirstUser = (await userModel.countDocuments()) === 0
        let user = new userModel({
            username,
            email,
            fullname,
            password,
            private: req.body.isPrivate,
            role: isFirstUser ? 'ADMIN' : 'USER'
        })
        user = await user.save()

        req.flash('success', "You signed in successfully :))")
        return res.status(201).redirect('/auth/login')

        // return successResponse(res, 201, {
        //     message: "User created successfully :))",
        //     user: { ...user.toObject(), password: undefined }
        // })
    } catch (err) {
        next(err)
    }
}

module.exports.loginPage = async (req, res, next) => {

    try {
        res.status(200).render('auth/login')
    } catch (err) {
        next(err)
    }
}

module.exports.login = async (req, res, next) => {

    try {
        const { username, password } = req.body
        try {
            await validator.loginValidation.validate(req.body)
        } catch (err) {
            req.flash('error', err.errors[0])
            return res.status(400).redirect('/auth/login')
        }

        const user = await userModel.findOne({ $or: [{ username }, { email: username }] }).lean()
        if (!user) {
            req.flash('error', "Username not found!!")
            return res.status(404).redirect('/auth/login')
        }

        const isCorractPassword = await bcryptjs.compare(password, user.password)
        if (!isCorractPassword) {
            req.flash('error', "Email or password is incorract!!")
            return res.status(400).redirect('/auth/login')
        }

        const accessToken = jwt.sign({ userID: user._id }, 'de25df8c62ve2cveuif2fe2', {
            expiresIn: '5s',
        })
        const refreshToken = await refreshTokenModel.createToken(user)

        res.cookie('access-token', accessToken, {
            maxAge: 90_000_000,
            httpOnly: true
        })
        res.cookie('refresh-token', refreshToken, {
            maxAge: 90_000_000,
            httpOnly: true
        })

        req.flash('success', "You loged in sucessfully :))")
        return res.status(200).redirect('/')
    } catch (err) {
        next(err)
    }
}

module.exports.logout = async (req, res, next) => {

    try {
        const refreshToken = req.cookies['refresh-token']
        await refreshTokenModel.findOneAndDelete({ token: refreshToken })
        res.clearCookie('refresh-token')
        res.clearCookie('access-token')
        req.flash('success', "You loged out successfully :))")
        return res.status(200).redirect('/auth/login')
    } catch (err) {
        next(err)
    }
}

module.exports.refreshToken = async (req, res, next) => {

    try {
        const refreshToken = req.cookies['refresh-token']
        if (!refreshToken) {
            req.flash('error', "Some thing went worng !!")
            return res.status(400).redirect('/auth/login')
        }
        const userID = await refreshTokenModel.varifyToken(refreshToken)
        if (!userID) {
            req.flash('error', "User info is not valid !!")
            res.clearCookie('refresh-token')
            res.clearCookie('access-token')
            return res.status(404).redirect('/auth/login')
        }

        await refreshTokenModel.findOneAndDelete({ token: refreshToken })
        const user = await userModel.findById(userID).lean()
        if (!user) {
            req.flash('error', "User not found")
            res.clearCookie('refresh-token')
            res.clearCookie('access-token')
            return res.status(404).redirect('/auth/login')
        }

        const accessToken = jwt.sign({ userID: user._id }, 'de25df8c62ve2cveuif2fe2', { expiresIn: '5s' })

        const newRefreshToken = await refreshTokenModel.createToken(user)

        res.cookie('access-token', accessToken, {
            maxAge: 90_000_000,
            httpOnly: true
        })
        res.cookie('refresh-token', newRefreshToken, {
            maxAge: 90_000_000,
            httpOnly: true
        })

        if (req.params.path === 'n') {
            return res.status(200).redirect('/')
        }

        if (req.params.path2 === undefined) {
            return res.status(200).redirect(`/${req.params.path}`)
        }
        return res.status(200).redirect(`/${req.params.path}/${req.params.path2}`)
        //* Success Message
    } catch (err) {
        next(err)
    }
}

module.exports.forgetPasswordPage = async (req, res, next) => {

    try {
        return res.status(200).render('auth/forgetPassword')
    } catch (err) {
        next(err)
    }
}

module.exports.forgetPassword = async (req, res, next) => {

    try {
        const isValidInput = await validator.recoveryValidation.validate(req.body)
        if (!isValidInput) {
            req.flash('error', isValidInput)
            return res.status(400).redirect('back')
        }
        const { email } = req.body
        const user = await userModel.findOne({ email })
        if (!user) {
            req.flash('error', "User not found !!")
            return res.status(404).redirect('back')
        }

        const resetToken = crypto.randomBytes(32).toString('hex')
        const expireTime = Date.now() + (1000 * 60 * 60)
        const resetPassword = resetPasswordModel({
            user: user._id,
            token: resetToken,
            tokenExpiretion: expireTime
        })
        await resetPassword.save()

        const transporter = nodeMailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'amhossainsh@gmail.com',
                pass: 'nfzb idom fbiz vetz'
            }
        })
        const mailOptions = {
            from: 'amhossainsh@gmail.com',
            to: email,
            subject: 'reset password for social media',
            html: `<h2>Hi ${user.fullname}</h2>
This link is for reseting password of your social media account 
<a href=https://amir-social-media.ir/auth/reset-password/${resetToken}>resetPassword link</a>
`
        }
        transporter.sendMail(mailOptions)

        req.flash('success', "Email for reseting password sent successfully ")
        return res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.resetPasswordPage = async (req, res, next) => {

    try {
        return res.status(200).render('auth/resetPassword')
    } catch (err) {
        next(err)
    }
}

module.exports.resetPassword = async (req, res, next) => {

    try {
        await validator.resetPasswordValidation.validate(req.body)
        const { token, password } = req.body
        const resetPassword = await resetPasswordModel.findOne({
            token,
            tokenExpiretion: { $gt: Date.now() }
        })
        if (!resetPassword) {
            req.flash('error', "Token is not valid!")
            return res.status(400).redirect('back')
        }

        const hashedPassword = await bcryptjs.hash(password, 10)
        const user = await userModel.findByIdAndUpdate(resetPassword.user, {
            password: hashedPassword
        })
        if (!user) {
            req.flash('error', "Something went wrong !!")
            return res.status(404).redirect('/auth/login')
        }

        await resetPasswordModel.findByIdAndDelete(resetPassword._id)
        req.flash('success', "Password resat successfully")
        res.status(200).redirect('/auth/login')
    } catch (err) {
        next(err)
    }
}
