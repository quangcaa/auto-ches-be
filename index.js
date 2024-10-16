const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const route = require('./routes/index')
const {app, server} = require("./socket/socket.js")

dotenv.config()

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

app.use(cors()) // enable cors for all routes 
app.use(express.json()) // allow parse req.body
app.use(cookieParser()) // allow parse cookies
// app.use(express.urlencoded({ extended: true })) // allow parse URL-encoded

route(app) // routes init

server.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`)
})