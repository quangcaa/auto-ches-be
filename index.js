const express = require('express')
const dotenv = require('dotenv')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const path = require('path')

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
    origin: '*',
    credentials: true,
    // allowedHeaders: ['Content-Type', 'x_authorization'],
}))
app.use(express.json()) // allow parse req.body
app.use(cookieParser()) // allow parse cookies
app.use(express.urlencoded({ extended: true })) // allow parse URL-encoded

// serve static files from the public directory
app.use(express.static(path.join(__dirname, 'dist')))

route(app) // routes init

// catch-all route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

httpServer.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`)
})