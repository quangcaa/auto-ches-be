const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')

const route = require('./routes/index')
const { createServer } = require('http')
const { initSocket } = require('./socket/socket.be')

dotenv.config()

const PORT = process.env.PORT || 3333
const NODE_ENV = process.env.NODE_ENV

const app = express()
const httpServer = createServer(app)

initSocket(httpServer) // init socket

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}))
app.use(express.json()) // allow parse req.body
app.use(cookieParser()) // allow parse cookies
app.use(express.urlencoded({ extended: true })) // allow parse URL-encoded

route(app) // routes init

httpServer.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`)
})