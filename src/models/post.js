const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    media: {
        path: { type: String, required: true },
        filename: { type: String, required: true }
    },
    description: {
        type: String,
        default: "Here's the information about ...",
        required: true
    },
    hashtags: {
        type: [String]
    },
    user: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    }
}, { timestamps: true })

const model = mongoose.model('posts', schema)

module.exports = model
