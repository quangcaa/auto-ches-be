const { sequelize, User, Passwordreset } = require('../db/models')
const { Op } = require('sequelize')

class PuzzleController {
    // @route GET /puzzle
    // @desc training with random puzzle
    // @access Private
    async playPuzzle(req, res) {

    }

}

module.exports = new PuzzleController()