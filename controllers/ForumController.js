const { sequelize, User, Forum, Topic, Post } = require('../db/models')
const { Op } = require('sequelize')

class ForumController {
    // @route [GET] /forum
    // @desc get all forum category
    // @access Private
    async getAllCategory(req, res) {
        try {
            const forum = await sequelize.query(
                `
                SELECT f.*,
                       COUNT(DISTINCT t.topic_id) AS topic_count, 
                       COUNT(p.post_id) AS post_count
                FROM forum f
                JOIN topics t ON t.category_id = f.category_id
                JOIN posts p ON p.topic_id = t.topic_id
                GROUP BY f.category_id
                `,
                {
                    type: sequelize.QueryTypes.SELECT
                }
            )

            return res.status(200).json({ success: true, forum })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getAllCategory: ${error.message}`
            })
        }
    }

    // @route [GET] /forum/:category_id
    // @desc get all topic of that category
    // @access Private
    async getTopics(req, res) {
        const { category_id } = req.params

        try {
            // check
            const checkCategory = await Forum.findByPk(category_id)
            if (!checkCategory) {
                return res.status(400).json({ success: false, message: 'Category not exist' })
            }

            // fetch
            const topics = await sequelize.query(
                `
                SELECT  t.topic_id,
                        t.subject,
                        t.user_id AS creator,
                        COUNT(p.post_id) - 1 AS replies,
                        MAX(p.created_at) AS last_post_time,
                        u.username AS last_post_user
                FROM topics t
                JOIN posts p ON p.topic_id = t.topic_id
                JOIN users u ON u.user_id = (
                    SELECT p2.user_id
                    FROM posts p2
                    WHERE p2.topic_id = t.topic_id
                    ORDER BY p2.created_at DESC
                    LIMIT 1
                )
                WHERE t.category_id = ?
                GROUP BY t.topic_id, t.subject, u.username
                ORDER BY last_post_time DESC
                `,
                {
                    replacements: [category_id],
                    type: sequelize.QueryTypes.SELECT
                }
            )

            return res.status(200).json({ success: true, topics })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getTopics: ${error.message}`
            })
        }
    }

    // @route [POST] /forum/:category_id/create
    // @desc create topic in forum
    // @access Private
    async createTopic(req, res) {
        const { category_id } = req.params
        const { subject, message } = req.body
        const user_id = req.user_id

        try {
            if (!subject || !message) {
                return res.status(400).json({ success: false, message: 'Subject or message cannot be empty' })
            }

            // check
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const checkCategory = await Forum.findByPk(category_id)
            if (!checkCategory) {
                return res.status(400).json({ success: false, message: 'Category not exist' })
            }

            // create topic
            const createdTopic = await Topic.create({
                category_id,
                user_id,
                subject
            })
            const createdPost = await Post.create({
                topic_id: createdTopic.topic_id,
                user_id,
                content: message
            })

            return res.status(200).json({ success: true, topic: createdTopic, post: createdPost })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in createTopic: ${error.message}`
            })
        }
    }

    // @route [DELETE] /forum/t/:topic_id
    // @desc delete topic 
    // @access Private
    async deleteTopic(req, res) {
        const { topic_id } = req.params
        const user_id = req.user_id

        try {
            // check
            const topic = await Topic.findByPk(topic_id)
            if (!topic) {
                return res.status(400).json({ success: false, message: 'Topic not found' })
            }

            if (topic.user_id !== user_id) {
                return res.status(403).json({ success: false, message: 'Unauthorized action' })
            }

            // delete
            await topic.destroy()

            return res.status(200).json({ success: true, message: 'Topic deleted successfully' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in deleteTopic: ${error.message}`
            })
        }
    }


    // @route [GET] /forum/:category_id/:topic_id
    // @desc get topic by id
    // @access Private
    async getPosts(req, res) {
        const { category_id, topic_id } = req.params

        try {
            const checkCategory = await Forum.findByPk(category_id)
            if (!checkCategory) {
                return res.status(400).json({ success: false, message: 'Category not exist' })
            }

            const posts = await sequelize.query(
                `
                SELECT  p.post_id,
                        p.user_id,
                        p.content,
                        p.created_at,
                        u.username,
                        u.online
                FROM posts p 
                JOIN topics t ON t.topic_id = p.topic_id
                JOIN users u ON u.user_id = p.user_id
                WHERE t.topic_id = ?
                ORDER BY p.created_at ASC
                `,
                {
                    replacements: [topic_id],
                    type: sequelize.QueryTypes.SELECT
                }
            )

            return res.status(200).json({ success: true, posts })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in getPosts: ${error.message}`
            })
        }
    }

    // @route [POST] /forum/:category_id/:topic_id/create
    // @desc create post  
    // @access Private
    async createPost(req, res) {
        const { category_id, topic_id } = req.params
        const { message } = req.body
        const user_id = req.user_id

        try {
            if (!message) {
                return res.status(400).json({ success: false, message: 'Content cannot be empty' })
            }

            // check
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const checkCategory = await Forum.findByPk(category_id)
            if (!checkCategory) {
                return res.status(400).json({ success: false, message: 'Category not exist' })
            }

            const checkTopic = await Topic.findByPk(topic_id)
            if (!checkTopic) {
                return res.status(400).json({ success: false, message: 'Topic not exist' })
            }

            // create
            const createdPost = await Post.create({
                topic_id,
                user_id,
                content: message
            })
            if (!createdPost) {
                return res.status(400).json({ success: false, message: 'Error in create post ! ! !' })
            }

            return res.status(200).json({ success: true, post: createdPost })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in createPost: ${error.message}`
            })
        }
    }

    // @route [DELETE] /forum/p/:post_id
    // @desc delete post  
    // @access Private
    async deletePost(req, res) {
        const { post_id } = req.params
        const user_id = req.user_id

        try {
            // check
            const user = await User.findByPk(user_id)
            if (!user) {
                return res.status(400).json({ success: false, message: 'User not found' })
            }

            const post = await Post.findByPk(post_id)
            if (!post) {
                return res.status(400).json({ success: false, message: 'Post not found' })
            }

            if (post.user_id !== user_id) {
                return res.status(403).json({ success: false, message: 'Unauthorized action' })
            }

            // delete
            await post.destroy()

            return res.status(200).json({ success: true, message: 'Post deleted successfully' })
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: `Error in deletePost: ${error.message}`
            })
        }
    }

}

module.exports = new ForumController()