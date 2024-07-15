const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    sender: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    reciever: {
        type: mongoose.Types.ObjectId,
        ref: 'users',
        required: true
    },
    status: {
        type: 'string',
        default: 'waiting for a reply',
        required: true
    },
    description: {
        type: 'string',
        required: false
    }
}, { timestamps: true })

const model = mongoose.model('requests', schema)

module.exports = model
