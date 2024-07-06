const multer = require('multer')
const fs = require('fs')
const path = require('path')


module.exports.multerStorage = (destination, allowedTypes = /jpeg|png|webp|jpg/) => {

    if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination)
    }

    const storage = multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, destination)
        },
        filename: function (req, file, cb) {
            const uniqueName = Math.floor(Math.random() * 1e9)
            const ext = path.extname(file.originalname)
            cb(null, uniqueName + ext)
        }
    })

    const fileFilter = function (req, file, cb) {
        if (allowedTypes.test(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error("File type is not allowed !!"))
        }
    }

    const upload = multer({
        storage,
        fileFilter,
        limits: { fileSize: 512_000_000 }
    })

    return upload
}
