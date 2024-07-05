const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const app = express();
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'inventory-db', // Asegúrate de que este nombre sea correcto
  password: '29930427',
  port: 5432,
});

app.use(cors());
app.use(express.json());

const jwtSecret = 'tu_secreto';

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
      [username, email, hashedPassword]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  try {
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1 OR email = $2',
      [usernameOrEmail, usernameOrEmail]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, jwtSecret, { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rutas de productos
app.get('/products', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products');
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/products', async (req, res) => {
  const { name, description, price, brand } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO products (name, description, price, brand) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, description, price, brand]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price, brand } = req.body;

  try {
    const result = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, brand = $4 WHERE id = $5 RETURNING *',
      [name, description, price, brand, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM products WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rutas de ubicaciones
app.get('/locations', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM locations');
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/locations', async (req, res) => {
  const { name, address } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO locations (name, address) VALUES ($1, $2) RETURNING *',
      [name, address]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/locations/:id', async (req, res) => {
  const { id } = req.params;
  const { name, address } = req.body;

  try {
    const result = await pool.query(
      'UPDATE locations SET name = $1, address = $2 WHERE id = $3 RETURNING *',
      [name, address, id]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/locations/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query('DELETE FROM locations WHERE id = $1', [id]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Rutas de inventario del usuario
app.get('/user/:userId/inventory', async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      `SELECT p.*, up.quantity FROM products p
       JOIN user_products up ON p.id = up.product_id
       WHERE up.user_id = $1`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/user/:userId/inventory', async (req, res) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO user_products (user_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [userId, productId, quantity]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/user/:userId/inventory/:productId', async (req, res) => {
  const { userId, productId } = req.params;
  const { quantity } = req.body;

  try {
    const result = await pool.query(
      'UPDATE user_products SET quantity = $1 WHERE user_id = $2 AND product_id = $3 RETURNING *',
      [quantity, userId, productId]
    );
    res.json(result.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/user/:userId/inventory/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    await pool.query('DELETE FROM user_products WHERE user_id = $1 AND product_id = $2', [userId, productId]);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
