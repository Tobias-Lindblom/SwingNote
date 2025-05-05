
// Global felhaterare - fångar upp fel och returnerar standardiserat svar
const errorHandler = (err, req, res, next) => {
  // Använd befintlig statuskod om satt, annars statuskod 500
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;
    
    res.status(statusCode).json({
      message: err.message,
      // Visar stacktrace endast i utvecklingsläge
      stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
  };
  
  module.exports = { errorHandler };