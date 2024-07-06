//* Hepler function to format success response
const successResponse = (res, statusCode, data) => {
    return res.status(statusCode)
        .json({ status: statusCode, success: true, data })
}

//* Hepler function to format error response
const errorResponse = (res, statusCode = 500, message, data) => {
    console.log({ message, data }) // Log error details
    return res.status(statusCode)
        .json({ status: statusCode, success: false, error: message, data })
}

module.exports = {
    successResponse,
    errorResponse
}