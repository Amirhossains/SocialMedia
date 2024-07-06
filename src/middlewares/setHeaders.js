module.exports.setHeaders = (req, res, next) => {
    res.setHeader('Access-Controll-Allow-origin', '*')
    res.setHeader('Access-Controll-Allow-Methods', 'GET, POST, PUT, DELETE')
    res.setHeader('Access-Controll-Allow-Headers', 'Content-Type, Authorization')
    next()
}
