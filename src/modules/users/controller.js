const userModel = require('./../../models/User')
const bcryptjs = require('bcryptjs')
const validator = require('./validator')

module.exports.editPage = async (req, res, next) => {

    try {
        const user = await userModel.findById(req.user._id).lean()

        res.status(200).render('editUser/edit', {
            user
        })
    } catch (err) {
        next(err)
    }
}

module.exports.edit = async (req, res, next) => {

    try {
        await validator.editValidation.validate(req.body, { abortEarly: false })
        const { email, username, fullname, password } = req.body

        const user = await userModel.findById(req.user._id)
        const isValidPassword = await bcryptjs.compare(password, user.password)
        if (!isValidPassword) {
            req.flash('error', "Password is incorract !!")
            return res.status(400).redirect('/users/edit')
        }

        if (req.file) {
            await userModel.findByIdAndUpdate(req.user._id, {
                profilePicture: `/images/profiles/${req.file.filename}`,
                email,
                fullname,
                username
            },
                { new: true }
            )
        } else {
            await userModel.findByIdAndUpdate(req.user._id, {
                email,
                fullname,
                username
            },
                { new: true }
            )
        }

        req.flash('success', "Page updated successfully :))")
        res.status(201).redirect('/users/edit')
    } catch (err) {
        next(err)
    }
}
