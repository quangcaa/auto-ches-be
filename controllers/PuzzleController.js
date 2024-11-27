const { sequelize, User, Passwordreset } = require('../db/models')
const { Op } = require('sequelize')

const puzzles = [
    {
      id: "00sHx",
      fen: "q3k1nr/1pp1nQpp/3p4/1P2p3/4P3/B1PP1b2/B5PP/5K2 b k - 0 17",
      moves: ["e8d7", "a2e6", "d7d8", "f7f8"],
      rating: 1760,
      popularity: 83,
      themes: ["mate", "mateIn2", "middlegame", "short"],
      gameUrl: "https://lichess.org/yyznGmXs/black#34",
      opening: ["Italian_Game", "Italian_Game_Classical_Variation"],
    },
  ];

class PuzzleController {
    // @route GET /puzzle
    // @desc training with random puzzle
    // @access Private
    playPuzzle(req, res) {
        const puzzle = puzzles[Math.floor(Math.random() * puzzles.length)];
        res.json(puzzle);
    }

}

module.exports = new PuzzleController()