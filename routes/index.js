const authRouter = require('./auth')
const inboxRouter = require('./inbox')
const puzzleRouter = require('./puzzle')
const forumRouter = require('./forum')
const newsRouter = require('./news')
const learnRouter = require('./learn')
const profileRouter = require('./profile')
const friendshipRouter = require('./friendship')

const route = (app) => {
    app.use('/auth', authRouter)
    app.use('/profile', profileRouter)
    app.use('/profile', friendshipRouter)
    app.use('/inbox', inboxRouter)
    app.use('/puzzle', puzzleRouter)
    app.use('/forum', forumRouter)
    app.use('/news', newsRouter)
    app.use('/learn', learnRouter)
};

module.exports = route