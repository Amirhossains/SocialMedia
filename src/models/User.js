const mongoose = require('mongoose')
const bcryptjs = require('bcryptjs')

const schema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    biography: {
        type: String,
        required: false
    },
    fullname: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        required: false
    },
    role: {
        type: String,
        enum: ['USER', 'ADMIN'],
        default: 'USER',
        required: true
    },
    private: {
        type: Boolean,
        default: false
    },
    isVerified: {
        type: Boolean,
        default: true
    }
}, { timestamps: true }
)

schema.pre('save', async function (next) {
    try {
        this.password = await bcryptjs.hash(this.password, 10)
        next()
    } catch (err) {
        next(err)
    }
})

const model = mongoose.model('users', schema)

module.exports = model