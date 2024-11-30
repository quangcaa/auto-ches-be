const { User, Report } = require('../db/models')
const { Op } = require('sequelize')

class ReportController {

    // @route [GET] /report/
    // @desc Get all reports
    // @access Private
    async getAllReport(req, res) {
        try {
            const reports = await Report.findAll({
                order: [['created_at', 'DESC']],
                include: [
                    { model: User, as: 'Reporter', attributes: ['username'] },
                    { model: User, as: 'Reported', attributes: ['username'] }
                ]
            });

            return res.status(200).json({ success: true, data: reports });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllReport: ${error.message}`
            });
        }
    }

    
}

module.exports = new ReportController()