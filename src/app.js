const express = require('express')
const path = require('path')
const morgan = require('morgan')
const flash = require('express-flash')
const session = require('express-session')
const cookie = require('cookie-parser')

//* Requiring Routers
const authRouter = require('./modules/auth/router')
const uploadPostsRouter = require('./modules/posts/router')
const pageRouters = require('./modules/pages/router')
const userRouters = require('./modules/users/router')
const homeRouters = require('./modules/home/router')
const swaggerRouter = require('./modules/apiDoc/swagger.routes')
const { setHeaders } = require('./middlewares/setHeaders')
const { errorHandler } = require('./middlewares/errorHandler')

const app = express()

//* Static folders
app.use('/css', express.static(path.join(__dirname, '..', 'public', 'css')))
app.use('/js', express.static(path.join(__dirname, '..', 'public', 'js')))
app.use('/fonts', express.static(path.join(__dirname, '..', 'public', 'fonts')))
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images')))

//* Template engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

//* BodyParser
app.use(express.urlencoded({ limit: '50mb', extended: true }))
app.use(express.json())

//* Express-session-flash
app.use(session({
    secret: "Secret Key",
    resave: false,
    saveUninitialized: false
}))
app.use(flash())

//* Cookie Parser
app.use(cookie(process.env.JWT_SECRET_KEY))

//* Cors policy
app.use(setHeaders)

//* Getting Status Of Requests
app.use(morgan('dev'))

//* Routers
app.use('/', homeRouters)
app.use('/auth', authRouter)
app.use('/posts', uploadPostsRouter)
app.use('/pages', pageRouters)
app.use('/users', userRouters)
app.use('/api-doc', swaggerRouter)

//* not found page
app.use((req, res) => {
    res.status(200).json({ message: `path ${req.path} not found` })
})

// TODO: Needs features
app.use(errorHandler)

module.exports = app
