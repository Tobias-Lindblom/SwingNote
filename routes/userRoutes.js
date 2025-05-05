const express = require('express');
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getMe,
  getUsers,
  getAllUsers,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API för användarhantering
 */

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Registrera en ny användare
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 description: Användarens namn
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Användarens e-postadress
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Användarens lösenord
 *     responses:
 *       201:
 *         description: Användare skapad
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Användarens unika id
 *                 name:
 *                   type: string
 *                   description: Användarens namn
 *                 email:
 *                   type: string
 *                   description: Användarens e-postadress
 *                 token:
 *                   type: string
 *                   description: JWT-token för autentisering
 *       400:
 *         description: Ogiltig inmatning eller e-post redan upptagen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Logga in användare
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Användarens e-postadress
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Användarens lösenord
 *     responses:
 *       200:
 *         description: Inloggad med JWT-token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Användarens unika id
 *                 name:
 *                   type: string
 *                   description: Användarens namn
 *                 email:
 *                   type: string
 *                   description: Användarens e-postadress
 *                 token:
 *                   type: string
 *                   description: JWT-token för autentisering
 *       400:
 *         description: Ogiltig inmatning
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Ogiltiga inloggningsuppgifter
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/me:
 *   get:
 *     summary: Hämta inloggad användare
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Användaruppgifter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: Användarens unika id
 *                 name:
 *                   type: string
 *                   description: Användarens namn
 *                 email:
 *                   type: string
 *                   description: Användarens e-postadress
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/me', protect, getMe);

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Hämta alla användare
 *     description: Hämtar alla användare för vänförfrågningar eller delning. Inkluderar information om vänrelationer.
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista av användare
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Användarens unika id
 *                   name:
 *                     type: string
 *                     description: Användarens namn
 *                   email:
 *                     type: string
 *                     description: Användarens e-post
 *                   isFriend:
 *                     type: boolean
 *                     description: Om användaren är en vän
 *                   hasIncomingRequest:
 *                     type: boolean
 *                     description: Om det finns en inkommande vänförfrågan
 *                   hasSentRequest:
 *                     type: boolean
 *                     description: Om det finns en utgående vänförfrågan
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Serverfel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', protect, getAllUsers);

/**
 * @swagger
 * /api/users/search:
 *   get:
 *     summary: Sök efter användare för att skicka vänförfrågningar
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Sökterm för att filtrera användare på namn eller e-post
 *     responses:
 *       200:
 *         description: Lista av användare som matchade sökningen
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: Användarens unika id
 *                   name:
 *                     type: string
 *                     description: Användarens namn
 *                   email:
 *                     type: string
 *                     description: Användarens e-post
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Serverfel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/search', protect, getUsers);

module.exports = router;