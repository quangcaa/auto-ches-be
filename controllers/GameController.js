const { sequelize, User, Game } = require('../db/models')
const { Op } = require('sequelize')

class GameController {
    // @route [POST] /create-computer
    // @desc create computer game to db
    // @access Private
    async createComputerGame(req, res) {
        const { strength, side } = req.body
        const user_id = req.user_id

        try {
            const { nanoid } = await import('nanoid')
            const game_id = nanoid()

            // const Game = 

            return res.status(200).json({ success: true, game_id })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in createComputerGame: ${error.message}`
            })
        }
    }

}

module.exports = new GameController()