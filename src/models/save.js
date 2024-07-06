const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'posts',
        required: true
    },

}, { timestamps: true })

const model = mongoose.model('saves', schema)

module.exports = model
