const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const noteRoutes = require('./routes/noteRoutes');
const { errorHandler } = require('./middleware/errorMiddleware');
const { swaggerUi, swaggerDocs } = require('./config/swagger');


// Anslut till MongoDB
connectDB();

// Bekräfta MongoDB-anslutning
mongoose.connection.once('open', () => {
  console.log('MongoDB anslutningen har upprättats utan problem!');
});
  
// Hanterar eventuella fel vid MongoDB-anslutning
mongoose.connection.on('error', err => {
  console.error('MongoDB anslutningsfel:', err);
  process.exit(1); // Avsluta processen vid fel
});

const app = express();

// Middleware för att hantera JSON i inkommande requests
app.use(express.json());

//Tillåt CORS-förfrågningar från klienter (tex frontend-appar)
app.use(cors());

// API-dokumentation via Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rutter för användarhantering
app.use('/api/users', userRoutes);

//Rutter för anteckningar
app.use('/api/notes', noteRoutes);

//Rutter för vänfunktionalitet
app.use('/api/friends', require('./routes/friendRoutes'));

// Felhanteringsmiddleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servern är startad på port ${PORT}`));