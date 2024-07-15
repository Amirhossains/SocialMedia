const userModel = require('./../../models/User')
const requestModel = require('./../../models/request')
const followModel = require('./../../models/follows')

module.exports.send = async (req, res, next) => {

    try {
        const page = await userModel.findById(req.params.pageID)
        if (page.private !== true) {
            req.flash('error', "Page is not private to send request !!")
            return res.status(400).redirect('back')
        }

        const isRequestExist = await requestModel.findOne({
            sender: req.user._id,
            reciever: page._id
        })
        if (isRequestExist) {
            req.flash('error', "You have already submitted a request !!")
            return res.status(409).redirect('back')
        }

        await requestModel.create({
            sender: req.user._id,
            reciever: page._id
        })

        req.flash('success', "Request sent successfully :))")
        res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.unsend = async (req, res, next) => {

    try {
        const request = await requestModel.findOneAndDelete({
            sender: req.user._id,
            reciever: req.params.pageID
        })
        if (!request) {
            req.flash('error', "You have not sent request !!")
            return res.status(404).redirect('back')
        }

        req.flash('success', "Request unsend successfully !!")
        res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.accept = async (req, res, next) => {

    try {
        const senderID = req.body.pageID
        const user = req.user
        const request = await requestModel.findOne({
            sender: senderID,
            reciever: user._id
        })
        if (!request) {
            req.flash('error', "Some thing went worng !!")
            return res.status(404).redirect('back')
        }

        if (request.status !== 'waiting for a reply') {
            req.flash('error', "The request is not answerable !!")
            return res.status(403).redirect('back')
        }

        await requestModel.findByIdAndUpdate(request._id, {
            status: 'accepted'
        })
        await followModel.create({
            follower: senderID,
            following: user._id
        })
        req.flash('success', "Request accepted successfully :))")
        res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}

module.exports.reject = async (req, res, next) => {

    try {
        const senderID = req.body.pageID
        const user = req.user
        const request = await requestModel.findOne({
            sender: senderID,
            reciever: user._id
        })
        if (!request) {
            req.flash('error', "Some thing went worng !!")
            return res.status(404).redirect('back')
        }

        if (request.status !== 'wating for a reply') {
            req.flash('error', "The request is not answerable !!")
            return res.status(403).redirect('back')
        }

        await requestModel.findByIdAndUpdate(request._id, {
            $set: {
                status: 'rejected'
            }
        })
        req.flash('success', "Request rejected successfully :))")
        res.status(200).redirect('back')
    } catch (err) {
        next(err)
    }
}
