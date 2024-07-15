const mongoose = require('mongoose')
const { v4: uuidv4 } = require('uuid')

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    expireTime: {
        type: Date,
        required: true
    }
})

schema.statics.createToken = async (user) => {

    const expireInDays = 20
    const refreshToken = uuidv4()
    const refreshTokenDocument = new model({
        user: user._id,
        token: refreshToken,
        expireTime: new Date(Date.now() + expireInDays * 24 * 60 * 60 * 1000)
    })
    await refreshTokenDocument.save()
    return refreshToken
}

schema.statics.varifyToken = async (token) => {

    const refreshTokenDocument = await model.findOne({ token })
    if (refreshTokenDocument && refreshTokenDocument.expireTime >= Date.now()) {
        return refreshTokenDocument.user
    } else {
        return null
    }
}

const model = mongoose.model('refresh_token', schema)

module.exports = model
