const app = require('./app')
const mongoose = require('mongoose')

//* Load env
// const production = process.env.NODE_ENV === 'production'
// if (!production) {
//     dotenv.config()
// }

//* Server
function startServer() {
    app.listen(3006, () => {
        console.log(`Server Is Running On Port 3006 
with deploy mode`)
    })
}

//* DataBase connection 
async function connectToDataBase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/SocialMedia', {
            authSource: 'admin'
        })
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
