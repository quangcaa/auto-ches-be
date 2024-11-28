const { sequelize, User, Game } = require('../db/models')
const { Op } = require('sequelize')
const shortid = require('shortid');

class GameController {
    // @route [POST] /game/create-computer
    // @desc create computer game to db
    // @access Private
    async createComputerGame(req, res) {
        const { strength, side } = req.body;
        const user_id = req.user_id;
    
        // Validate user_id
        if (!user_id) {
            return res.status(400).json({ success: false, message: 'User ID is required' });
        }
    
        // Validate side
        if (!['white', 'black'].includes(side)) {
            return res.status(400).json({ success: false, message: 'Invalid side value' });
        }
    
        // Validate strength
        if (!Number.isInteger(strength) || strength < 1 || strength > 8) {
            return res.status(400).json({ success: false, message: 'Invalid strength value' });
        }
    
        let white, black;
    
        if (side === 'white') {
            white = user_id;
            black = 3;
        } else {
            white = 3;
            black = user_id;
        }
    
        try {
            const game_id = shortid.generate()
    
            const game = await Game.create({
                game_id,
                type: 'computer',
                white_player_id: white,
                black_player_id: black,
                start_time: Date.now(),
                status: 'IN_PROGRESS',
                fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
                strength: strength,
            });
    
            console.log(`Game created with ID: ${game_id}`);

            return res.status(200).json({ success: true, game_id });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: `Error in createComputerGame: ${error.message}`,
            });
        }
    }



    // @route [GET] /game/:game_id
    // @desc get game info from db
    // @access Private
    async getGameById(req, res) {
        const { game_id } = req.params
        const user_id = req.user_id

        try {
            const game = await Game.findByPk(game_id)

            if(!game) {
                return res.status(400).json({ success: false, message: 'Game not found' })
            }

            return res.status(200).json({ success: true, game })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getGameById: ${error.message}`
            })
        }
    }
}

module.exports = new GameController()