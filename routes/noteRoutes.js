const express = require('express');
const router = express.Router();
const {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  searchNotes,
  shareNote,
  removeSharing,
  getSharedNotes
} = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Notes
 *   description: API för hantering av anteckningar
 */

/**
 * @swagger
 * /api/notes:
 *   get:
 *     summary: Hämta alla användarens anteckningar
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista av anteckningar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', protect, getNotes);

/**
 * @swagger
 * /api/notes:
 *   post:
 *     summary: Skapa en ny anteckning
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *                 description: Anteckningens titel
 *               content:
 *                 type: string
 *                 description: Anteckningens innehåll
 *               color:
 *                 type: string
 *                 enum: [yellow, green, blue, pink, purple]
 *                 description: Anteckningens färg
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Taggar för anteckningen
 *     responses:
 *       201:
 *         description: Anteckning skapad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Ogiltig begäran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', protect, createNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   put:
 *     summary: Uppdatera en anteckning
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Antecknings-ID
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Anteckningens titel
 *               content:
 *                 type: string
 *                 description: Anteckningens innehåll
 *               color:
 *                 type: string
 *                 enum: [yellow, green, blue, pink, purple]
 *                 description: Anteckningens färg
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Taggar för anteckningen
 *     responses:
 *       200:
 *         description: Anteckning uppdaterad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Ogiltig begäran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Anteckning hittades inte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:id', protect, updateNote);

/**
 * @swagger
 * /api/notes/{id}:
 *   delete:
 *     summary: Ta bort en anteckning
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Antecknings-ID
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Anteckning borttagen
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID för den borttagna anteckningen
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Anteckning hittades inte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:id', protect, deleteNote);

/**
 * @swagger
 * /api/notes/{id}/share:
 *   post:
 *     summary: Dela en anteckning med en annan användare
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Antecknings-ID
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
 *                 description: ID för användaren att dela med
 *               allowEditing:
 *                 type: boolean
 *                 description: Om användaren ska få redigera anteckningen
 *                 default: false
 *     responses:
 *       200:
 *         description: Anteckning delad
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       400:
 *         description: Ogiltig begäran
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Anteckning eller användare hittades inte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id/share').post(protect, shareNote);

/**
 * @swagger
 * /api/notes/{id}/share/{userId}:
 *   delete:
 *     summary: Ta bort delning av anteckning för specifik användare
 *     tags: [Notes]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Antecknings-ID
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: Användar-ID att ta bort delning för
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Delning borttagen
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Note'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Anteckning eller användare hittades inte
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/:id/share/:userId').delete(protect, removeSharing);

/**
 * @swagger
 * /api/notes/search:
 *   get:
 *     summary: Sök bland användarens anteckningar
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Sökterm för titel
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Filtrera på taggar (kommaseparerad lista)
 *       - in: query
 *         name: color
 *         schema:
 *           type: string
 *           enum: [yellow, green, blue, pink, purple]
 *         description: Filtrera på färg
 *     responses:
 *       200:
 *         description: Lista av matchande anteckningar
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/search').get(protect, searchNotes);

/**
 * @swagger
 * /api/notes/shared-with-me:
 *   get:
 *     summary: Hämta alla anteckningar som delats med användaren
 *     tags: [Notes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista över anteckningar som delats med användaren
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Note'
 *       401:
 *         description: Inte behörig
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.route('/shared-with-me').get(protect, getSharedNotes);

module.exports = router;