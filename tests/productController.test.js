const request = require('supertest');
const app = require('../app');
const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let token;

beforeAll(async () => {
  // Conectar a la base de datos de pruebas
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Crear un usuario de prueba y generar un token
  const hashedPassword = await bcrypt.hash('password123', 10);
  const user = await User.create({ email: 'test@example.com', password: hashedPassword });
  token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
});

afterAll(async () => {
  // Limpiar la base de datos y cerrar la conexión
  await User.deleteMany({});
  await Product.deleteMany({});
  await mongoose.connection.close();
});

describe('Productos', () => {
  it('Debe crear un producto', async () => {
    const res = await request(app)
      .post('/api/products')
      .send({ nombre: 'Producto1', precio: 100, descripcion: 'Descripción', cantidad: 10 })
      .set('Authorization', `Bearer ${token}`); // Usa el token válido

    expect(res.status).toBe(201);
    expect(res.body.nombre).toBe('Producto1');
  });
});
