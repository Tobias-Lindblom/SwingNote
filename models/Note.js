const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     Note:
 *       type: object
 *       required:
 *         - title
 *         - content
 *         - user
 *       properties:
 *         _id:
 *           type: string
 *           description: Anteckningens unika id
 *           example: 60d21b4967d0d8992e610c86
 *         user:
 *           type: string
 *           description: ID för användaren som äger anteckningen
 *           example: 60d21b4967d0d8992e610c85
 *         title:
 *           type: string
 *           description: Anteckningens titel
 *           example: Möte med teamet
 *         content:
 *           type: string
 *           description: Anteckningens innehåll
 *           example: Diskutera nya projektet och planera tidslinje.
 *         color:
 *           type: string
 *           description: Färgen på anteckningen
 *           enum: [yellow, green, blue, pink, purple]
 *           example: yellow
 *         tags:
 *           type: array
 *           description: Lista med taggar för anteckningen
 *           items:
 *             type: string
 *           example: [arbete, möte, projekt]
 *         sharedWith:
 *           type: array
 *           description: Lista över användare som anteckningen är delad med
 *           items:
 *             type: string
 *             description: Användar-ID
 *         isShared:
 *           type: boolean
 *           description: Om anteckningen är delad med andra
 *           example: false
 *         allowEditing:
 *           type: boolean
 *           description: Om delade användare kan redigera anteckningen
 *           example: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Datum när anteckningen skapades
 *         modifiedAt:
 *           type: string
 *           format: date-time
 *           description: Datum när anteckningen senast modifierades
 */
const noteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: [true, 'Please add a title'],
    },
    content: {
      type: String,
      required: [true, 'Please add content'],
    },
    color: {
      type: String,
      default: 'yellow',
      enum: ['yellow', 'green', 'blue', 'pink', 'purple']
    },
    tags: {
      type: [String],
      default: []
    },
    sharedWith: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    isShared: {
      type: Boolean,
      default: false
    },
    allowEditing: {
      type: Boolean,
      default: false
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    modifiedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Note', noteSchema);