// middlewares/errorHandler.js

const errorHandler = (err, req, res, next) => {
    console.error(err.stack); // Imprime el error en la consola
  
    // Respuesta al cliente
    res.status(500).json({
      message: 'Ocurrió un error en el servidor',
      error: err.message, // Opcional: enviar el mensaje de error al cliente
    });
  };
  
  module.exports = errorHandler;