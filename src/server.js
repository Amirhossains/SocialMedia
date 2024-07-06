const app = require('./app')
const mongoose = require('mongoose')

const dotenv = require('dotenv')

//* Load env
const production = process.env.NODE_ENV === 'production'
if (!production) {
    dotenv.config()
}

//* Server
function startServer() {
    app.listen(process.env.PORT, () => {
        console.log(`Server Is Running On Port ${process.env.PORT} 
with ${production ? "production" : "development"} mode`)
    })
}

//* DataBase connection 
async function connectToDataBase() {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected To ${mongoose.connection.host}`)
    } catch (err) {
        console.log(`Error at connectiong to database -> ${err}`)
        process.exit(1)
    }
}

async function run() {
    await connectToDataBase()
    startServer()
}

run()
