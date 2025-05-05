const mongoose = require('mongoose');


// Funktion för att ansluta till MongoDB
const connectDB = async () => {
  try {
    console.log('Försöker ansluta till MongoDB...');
    
    // FÖrsök ansluta med URI från miljövariabeln (.env)
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Ansluten till MongoDB!');
  } catch (error) {
    // Logga felmeddelande vid misslyckad anslutning
    console.error('MongoDB anslutningsfel:', error.message);
    console.error(error);
    
    // Avsluta processen med felkod 1
    process.exit(1);
  }
};

module.exports = connectDB;