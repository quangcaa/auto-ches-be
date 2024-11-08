const { User } = require('../db/models')
const { Op } = require('sequelize')

class SearchController {

    // @route [GET] /search/:searchText
    // @desc search user with params
    // @access Private
    async searchUser(req, res) {
        const { searchText } = req.params

        if (!searchText) {
            return res.status(400).json({ message: 'Please provide search term' })
        }

        try {
            const users = await User.findAll({
                where: {
                    username: {
                        [Op.like]: `${searchText}%`
                    }
                },
                attributes: ['user_id', 'username', 'online']
            })

            return res.status(200).json({ success: true, users })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in searchUser: ${error.message}`
            })
        }
    }
}

module.exports = new SearchController()