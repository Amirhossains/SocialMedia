module.exports.errorHandler = (err, req, res, next) => {
    if (err.errors) {
        req.flash('error', err.errors)
        return res.status(400).redirect('back')
    }
    console.log(err)
}
