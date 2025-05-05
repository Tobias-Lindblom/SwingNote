const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
} = require('../controllers/friendController');

/**
 * @swagger
 * tags:
 *   name: Friends
 *   description: API för hantering av vänner och vänförfrågningar
 */

/**
 * @swagger
 * /api/friends:
 *   get:
 *     summary: Hämta användarens vänner och vänförfrågningar
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lyckad hämtning av vänlista och förfrågningar
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 friends:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 friendRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 sentRequests:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Ej behörig - autentisering krävs
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', protect, getFriends);

/**
 * @swagger
 * /api/friends/request:
 *   post:
 *     summary: Skicka en vänförfrågan till en annan användare
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID för användare du vill skicka en förfrågan till
 *             example:
 *               userId: "60d21b4967d0d8992e610c90"
 *     responses:
 *       200:
 *         description: Vänförfrågan skickad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend request sent
 *       400:
 *         description: Ogiltig begäran - exempelvis om användaren redan är vän 
 *       401:
 *         description: Ej behörig
 *       404:
 *         description: Användare du försöker nå finns inte
 *       500:
 *         description: Serverfel
 */
router.post('/request', protect, sendFriendRequest);

/**
 * @swagger
 * /api/friends/accept:
 *   post:
 *     summary: Acceptera en inkommande vänförfrågan
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 description: ID på användaren vars vänförfrågan du accepterar
 *             example:
 *               userId: "60d21b4967d0d8992e610c90"
 *     responses:
 *       200:
 *         description: Förfrågan accepterad och vänskap upprättad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend request accepted
 *       400:
 *         description: Ogiltig eller redan accepterad förfråga
 *       401:
 *         description: Ej behörig
 *       404:
 *         description: Ingen matchande vänförfrågan hittades
 */
router.post('/accept', protect, acceptFriendRequest);

/**
 * @swagger
 * /api/friends/{id}:
 *   delete:
 *     summary: Ta bort en vän från din vänlista
 *     tags: [Friends]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID på vännen som ska tar bort
 *     responses:
 *       200:
 *         description: Vän borttagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Friend removed
 *       401:
 *         description: Ej behörig
 *       404:
 *         description: Vännen kunde inte hittas i listan
 */
router.delete('/:id', protect, removeFriend);

module.exports = router;