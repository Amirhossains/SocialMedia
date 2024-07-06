const userModel = require('./../models/User')

module.exports.getUserInof = async (userID) => {
    const user = await userModel.findById(userID)
    return user
}
