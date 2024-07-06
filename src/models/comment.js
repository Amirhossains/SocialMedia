const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    post: {
        type: mongoose.Types.ObjectId,
        ref: 'posts',
        required: true
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    //TODO Needs feature
    // parent: {
    //     type: mongoose.Types.ObjectId,
    //     ref: 'comments',
    //     required: true
    // },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const model = mongoose.model('comments', schema)

module.exports = model
