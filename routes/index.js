const authRouter = require('./auth')
const profileRouter = require('./profile')

const route = (app) => {
    app.use('/auth', authRouter)
    app.use('/profile', profileRouter)
};

module.exports = route