const userModel = require('./../models/User')
const fallowModel = require('./../models/follows')
const requestModel = require('./../models/request')

module.exports = async (userID, profileID) => {

    try {
        if (userID.toString() === profileID.toString()) {
            return true
        }

        const page = await userModel.findById(profileID).lean()
        if (!page.private) {
            return true
        }

        const isFallowed = await fallowModel.findOne({
            follower: userID,
            following: profileID
        }).lean()

        if (isFallowed) {
            return true
        }

        const request = await requestModel.findOne({
            sender: userID,
            reciever: profileID
        }).lean()

        if (request) {
            if (request.status === 'accepted') {
                return true
            }
        }
        return false
    } catch (err) {
        console.log(err)
    }
}
