const mongoose = require('mongoose');


async function connectDB () {
    try {     
        await mongoose.connect(process.env.MONGODB_URI)
        const connection = mongoose.connection
        connection.on('connected', () => {
            console.log("DB Conected")
        })
        connection.on('error', () => {
            console.log('Something went wrong while connecting')
        })
        console.log(connection.host)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDB;