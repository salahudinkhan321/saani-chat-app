const express = require('express');
const cors = require('cors')
require('dotenv').config({path: './.env'})
const connectDB = require('./config/connectDB.js')
const router = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const {app, server} = require("./socket/index.js")

// const app = express()
const port = process.env.PORT || 5000
app.use(express.json())
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}))
app.use(cookieParser())

app.get('/', (request, response) => {
    response.json({message: "Saani is Here " + port})
})

app.use('/api', router)

connectDB()
.then(() => {
    server.listen(port, () => {
        console.log(`Success Port on ${port}`)
    })
})
.catch((error) => {
    console.log(error)
})
