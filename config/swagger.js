const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Swagger-API-konfiguration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0', // Specifierar OpenAPI-versionen
    info: {
      title: 'SwingNote API',
      version: '1.0.0',
      description: 'API dokumentation för SwingNote ',
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server', // Beskrivning av servern
      },
    ],
    components: {
      securitySchemes: {
        // Definiera säkerhetsscheman för JWT-autentisering
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // Definierar "User"-modellen för Swagger
        User: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            _id: {
              type: 'string',
              description: 'Användarens unika id',
              example: '60d21b4967d0d8992e610c85',
            },
            name: {
              type: 'string',
              description: 'Användarens namn',
              example: 'Tobias Lindblom',
            },
            email: {
              type: 'string',
              description: 'Användarens email',
              example: 'tobias.lindblom@example.com',
            },
            password: {
              type: 'string',
              description: 'Användarens hashade lösenord',
              example: '$2a$10$3fPQhQvjF0.7eIpGj0Ll.eX2IeMZLHBecJqGi6LnOM9L4ZBSVzXCG',
            },
            friends: {
              type: 'array',
              description: 'Lista över användarens vänner',
              items: {
                type: 'string',
                description: 'Användar-ID för vän',
              },
            },
            friendRequests: {
              type: 'array',
              description: 'Lista över inkommande vänförfrågningar',
              items: {
                type: 'string',
                description: 'Användar-ID från förfrågningar',
              },
            },
            sentRequests: {
              type: 'array',
              description: 'Lista över skickade vänförfrågningar',
              items: {
                type: 'string',
                description: 'Användar-ID för skickade förfrågningar',
              },
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Datum när användaren skapades',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Datum när användaren senast uppdaterades',
            },
          },
        },

        // Definierar "Note"-modellen för Swagger
        Note: {
          type: 'object',
          required: ['title', 'content', 'user'],
          properties: {
            _id: {
              type: 'string',
              description: 'Anteckningens unika id',
              example: '60d21b4967d0d8992e610c86',
            },
            user: {
              type: 'string',
              description: 'ID för användaren som äger anteckningen',
              example: '60d21b4967d0d8992e610c85',
            },
            title: {
              type: 'string',
              description: 'Anteckningens titel',
              example: 'Möte med teamet',
            },
            content: {
              type: 'string',
              description: 'Anteckningens innehåll',
              example: 'Diskutera nya projektet och planera tidslinje.',
            },
            color: {
              type: 'string',
              description: 'Färgen på anteckningen',
              enum: ['yellow', 'green', 'blue', 'pink', 'purple'],
              example: 'yellow',
            },
            tags: {
              type: 'array',
              description: 'Lista med taggar för anteckningen',
              items: {
                type: 'string',
              },
              example: ['arbete', 'möte', 'projekt'],
            },
            sharedWith: {
              type: 'array',
              description: 'Lista över användare som anteckningen är delad med',
              items: {
                type: 'string',
                description: 'Användar-ID',
              },
            },
            isShared: {
              type: 'boolean',
              description: 'Om anteckningen är delad med andra',
              example: false,
            },
            allowEditing: {
              type: 'boolean',
              description: 'Om delade användare kan redigera anteckningen',
              example: false,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Datum när anteckningen skapades',
            },
            modifiedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Datum när anteckningen senast modifierades',
            },
          },
        },

        // Felobjekt-schema
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Felmeddelande',
            },
          },
        },
      },
    },
  },

  // Var Swagger ska leta efter kommentarer för att bygga dokumentation
  apis: [
    './models/*.js', // Modellfiler
    './routes/*.js', // API-rutter
    './server.js', // Huvudfil
  ],
};

// Generera Swagger-dokumentation
const swaggerDocs = swaggerJsdoc(swaggerOptions);

// Exportera gränssnittet för användning i server.js
module.exports = { swaggerUi, swaggerDocs };