const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    following: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    follower: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true })

const model = mongoose.model('fallows', schema)

module.exports = model
