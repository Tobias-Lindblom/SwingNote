const mongoose = require('mongoose');

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         _id:
 *           type: string
 *           description: Användarens unika id
 *           example: 60d21b4967d0d8992e610c85
 *         name:
 *           type: string
 *           description: Användarens namn
 *           example: Tobias Lindblom
 *         email:
 *           type: string
 *           description: Användarens email
 *           example: tobias.lindblom@example.com
 *         password:
 *           type: string
 *           description: Användarens hashade lösenord
 *           example: $2a$10$3fPQhQvjF0.7eIpGj0Ll.eX2IeMZLHBecJqGi6LnOM9L4ZBSVzXCG
 *         friends:
 *           type: array
 *           description: Lista över användarens vänner
 *           items:
 *             type: string
 *             description: Användar-ID för vän
 *         friendRequests:
 *           type: array
 *           description: Lista över inkommande vänförfrågningar
 *           items:
 *             type: string
 *             description: Användar-ID från förfrågningar
 *         sentRequests:
 *           type: array
 *           description: Lista över skickade vänförfrågningar
 *           items:
 *             type: string
 *             description: Användar-ID för skickade förfrågningar
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Datum när användaren skapades
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Datum när användaren senast uppdaterades
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    friends: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    friendRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
    sentRequests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('User', userSchema);