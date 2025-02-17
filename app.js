const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path'); // Importa el módulo 'path'
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Servir archivos estáticos desde la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));

// Ruta para la raíz (sirve el archivo index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Conexión a MongoDB local
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Conectado a MongoDB local'))
  .catch(err => console.log('Error al conectar a MongoDB', err));

// Rutas de la API
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});