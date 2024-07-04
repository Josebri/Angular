const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventory-db',
  password: '29930427',
  port: 5432,
});

const SECRET_KEY = 'your_secret_key';

app.use(bodyParser.json());
app.use(cors());

// Middleware de autenticación
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({ message: 'Token verification failed', error: err.message });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: 'Authorization header not provided' });
  }
};

// Configuración de Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'your_email@gmail.com',
    pass: 'your_email_password',
  },
});

// Registro de usuarios
app.post('/register', async (req, res) => {
  const { username, password, email, phone, profile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      'INSERT INTO users (username, password, email, phone, profile) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [username, hashedPassword, email, phone, profile]
    );
    res.status(201).json(newUser.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [usernameOrEmail, usernameOrEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];

    if (user.is_blocked) {
      return res.status(403).json({ error: 'User is blocked' });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      await pool.query(
        'UPDATE users SET attempts = attempts - 1 WHERE id = $1',
        [user.id]
      );

      const updatedUser = await pool.query(
        'SELECT * FROM users WHERE id = $1',
        [user.id]
      );

      if (updatedUser.rows[0].attempts === 0) {
        await pool.query(
          'UPDATE users SET is_blocked = TRUE WHERE id = $1',
          [user.id]
        );
      }

      return res.status(403).json({ error: 'Invalid password' });
    }

    await pool.query(
      'UPDATE users SET attempts = 3 WHERE id = $1',
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, profile: user.profile },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Logout
app.post('/logout', (req, res) => {
  try {
    res.json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Recuperación de contraseña
app.post('/recover-password', async (req, res) => {
  const { email } = req.body;

  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = userResult.rows[0];
    const token = jwt.sign(
      { id: user.id, username: user.username },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    const mailOptions = {
      from: 'your_email@gmail.com',
      to: user.email,
      subject: 'Password Recovery',
      text: `Please use the following link to reset your password: http://localhost:3000/reset-password?token=${token}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Password recovery email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Restablecer contraseña
app.post('/reset-password', async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, decoded.id]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Invalid or expired token' });
  }
});

// Rutas de administración
const adminRouter = express.Router();

// Middleware de autenticación para rutas de administrador
adminRouter.use(authenticate);

// Desbloquear usuario
adminRouter.post('/unblock-user', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { userId } = req.body;

  try {
    await pool.query(
      'UPDATE users SET is_blocked = FALSE, attempts = 3 WHERE id = $1',
      [userId]
    );
    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Añadir nuevo producto
adminRouter.post('/products', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, brand, quantity, reorder_level, image, supplier, price, category } = req.body;

  try {
    const newProduct = await pool.query(
      'INSERT INTO products (name, brand, quantity, reorder_level, image, supplier, price, category) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [name, brand, quantity, reorder_level, image, supplier, price, category]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los productos
adminRouter.get('/products', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const products = await pool.query('SELECT * FROM products');
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar producto
adminRouter.put('/products/:id', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;
  const { name, brand, quantity, reorder_level, image, supplier, price, category } = req.body;

  try {
    const updatedProduct = await pool.query(
      'UPDATE products SET name = $1, brand = $2, quantity = $3, reorder_level = $4, image = $5, supplier = $6, price = $7, category = $8 WHERE id = $9 RETURNING *',
      [name, brand, quantity, reorder_level, image, supplier, price, category, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar producto
adminRouter.delete('/products/:id', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Añadir nueva sede
adminRouter.post('/locations', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, address } = req.body;

  try {
    const newLocation = await pool.query(
      'INSERT INTO locations (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    );
    res.status(201).json(newLocation.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todas las sedes
adminRouter.get('/locations', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  try {
    const locations = await pool.query('SELECT * FROM locations');
    res.json(locations.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar sede
adminRouter.put('/locations/:id', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const updatedLocation = await pool.query(
      'UPDATE locations SET name = $1, address = $2 WHERE id = $3 RETURNING *',
      [name, address, id]
    );
    res.json(updatedLocation.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar sede
adminRouter.delete('/locations/:id', async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;

  try {
    await pool.query('DELETE FROM locations WHERE id = $1', [id]);
    res.json({ message: 'Location deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar rutas de administración a la aplicación principal
app.use('/admin', adminRouter);

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
