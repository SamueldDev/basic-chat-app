


import { Router } from "express";
import { createMessage, getMessages } from "../controller/messageController.js";
import { authenticate } from "../middleware/authenticate.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Messages
 *   description: Sending and retrieving chat messages
 */



/**
 * @swagger
 * /api/messages:
 *   post:
 *     summary: Create a new message
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - content
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Message created successfully
 *       400:
 *         description: Bad request
 */

router.post('/', authenticate, createMessage);




/**
 * @swagger
 * /api/messages:
 *   get:
 *     summary: Get all chat messages
 *     tags: [Messages]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of messages
 *       500:
 *         description: Failed to retrieve messages
 */
router.get('/', authenticate, getMessages);

export default router;
