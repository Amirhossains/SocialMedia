const userModel = require('./../models/User')
const fallowModel = require('../models/follows')

module.exports = async (userID, profileID) => {

    try {
        if (userID.toString() === profileID.toString()) {
            return true
        }

        const page = await userModel.findById(profileID)
        if (!page.private) {
            return true
        }

        const isFallowed = await fallowModel.findOne({
            follower: userID,
            following: profileID
        })

        if (isFallowed) {
            return true
        }
        return false
    } catch (err) {
        console.log(err)
    }
}
