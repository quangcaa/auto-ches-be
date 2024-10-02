const express = require('express')
const dotenv = require('dotenv')
const cookieParser = require('cookie-parser')

const route = require('./routes/index')

dotenv.config()

const app = express()

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

app.use(express.json()) // allow parse req.body
app.use(cookieParser()) // allow parse cookies
// app.use(express.urlencoded({ extended: true })) // allow parse URL-encoded

route(app) // routes init

app.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`)
})