const express = require('express')
const dotenv = require('dotenv')

const route = require('./routes/index')

dotenv.config()

const app = express()

const PORT = process.env.PORT
const NODE_ENV = process.env.NODE_ENV

route(app)

app.listen(PORT, () => {
    console.log(`Server is running in ${NODE_ENV} mode on port ${PORT}`)
})