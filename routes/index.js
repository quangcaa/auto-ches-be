const authRouter = require('./auth')
const accountRouter = require('./account')
const inboxRouter = require('./inbox')
const puzzleRouter = require('./puzzle')
const forumRouter = require('./forum')
const profileRouter = require('./profile')
const relationRouter = require('./relation')

const route = (app) => {
    app.use('/auth', authRouter)
    app.use('/account', accountRouter)
    app.use('/@', profileRouter)
    app.use('/rel', relationRouter)
    app.use('/inbox', inboxRouter)
    app.use('/puzzle', puzzleRouter)
    app.use('/forum', forumRouter)
}

module.exports = route