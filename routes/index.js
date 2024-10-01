const authRouter = require('./auth')
const profileRouter = require('./profile')
const friendshipRouter = require('./friendship')

const route = (app) => {
    app.use('/auth', authRouter)
    app.use('/profile', profileRouter)
    app.use('/profile', friendshipRouter)
};

module.exports = route