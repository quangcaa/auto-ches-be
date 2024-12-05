const { sequelize, User, Game, TimeControl } = require('../db/models')
const { Op } = require('sequelize')
const shortid = require('shortid');

class GameController {
    // @route [GET] /game/:game_id
    // @desc get game info from db
    // @access Private
    async getGameById(req, res) {
        const { game_id } = req.params
        const user_id = req.user_id

        try {
            const game = await Game.findOne({
                where: { game_id },
                include: [
                  {
                    model: User,
                    as: 'whitePlayer',
                    attributes: ['user_id', 'username', 'online'],
                  },
                  {
                    model: User,
                    as: 'blackPlayer',
                    attributes: ['user_id', 'username', 'online'],
                  },
                ],
              });

            if(!game) {
                return res.status(400).json({ success: false, message: 'Game not found' })
            }

            const clock = await TimeControl.findOne({
                where: {game_id}
            })

            return res.status(200).json({ success: true, game, clock })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getGameById: ${error.message}`
            })
        }
    }
}

module.exports = new GameController()