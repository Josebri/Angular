const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');
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


// Registro de usuarios
app.post('/register', async (req, res) => {
  const { username, password, email, phone, profile } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = await pool.query(
      `INSERT INTO users (username, password, email, phone, profile) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
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
      `SELECT * FROM users WHERE username = $1 OR email = $2`,
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
        `UPDATE users SET attempts = attempts - 1 WHERE id = $1`,
        [user.id]
      );

      const updatedUser = await pool.query(
        `SELECT * FROM users WHERE id = $1`,
        [user.id]
      );

      if (updatedUser.rows[0].attempts === 0) {
        await pool.query(
          `UPDATE users SET is_blocked = TRUE WHERE id = $1`,
          [user.id]
        );
      }

      return res.status(403).json({ error: 'Invalid password' });
    }

    await pool.query(
      `UPDATE users SET attempts = 3 WHERE id = $1`,
      [user.id]
    );

    const token = jwt.sign(
      { id: user.id, username: user.username, profile: user.profile },
      SECRET_KEY,
      { expiresIn: '1h' }
    );

    console.log('Generated token:', token); // Log para verificar el token generado
    res.json({ token }); // Devuelve el token al cliente
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

// Añadir nuevo producto
app.post('/admin/products', authenticate, async (req, res) => {
  if (!req.user || req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { name, brand, quantity, reorder_level, image, supplier, price, category } = req.body;

  try {
    const newProduct = await pool.query(
      `INSERT INTO products (name, brand, quantity, reorder_level, image, supplier, price, category)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [name, brand, quantity, reorder_level, image, supplier, price, category]
    );
    res.status(201).json(newProduct.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener todos los productos
app.get('/admin/products', authenticate, async (req, res) => {
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
app.put('/admin/products/:id', authenticate, async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { id } = req.params;
  const { name, brand, quantity, reorder_level, image, supplier, price, category } = req.body;

  try {
    const updatedProduct = await pool.query(
      `UPDATE products SET name = $1, brand = $2, quantity = $3, reorder_level = $4, image = $5, supplier = $6, price = $7, category = $8 WHERE id = $9 RETURNING *`,
      [name, brand, quantity, reorder_level, image, supplier, price, category, id]
    );
    res.json(updatedProduct.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar producto
app.delete('/admin/products/:id', authenticate, async (req, res) => {
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
app.post('/admin/locations', authenticate, async (req, res) => {
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
app.get('/admin/locations', authenticate, async (req, res) => {
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
app.put('/admin/locations/:id', authenticate, async (req, res) => {
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
app.delete('/admin/locations/:id', authenticate, async (req, res) => {
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

// Añadir producto a sede
app.post('/admin/inventory', authenticate, async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { product_id, location_id, quantity } = req.body;

  try {
    const newInventory = await pool.query(
      'INSERT INTO inventory (product_id, location_id, quantity) VALUES ($1, $2, $3) RETURNING *',
      [product_id, location_id, quantity]
    );
    res.status(201).json(newInventory.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Obtener inventario de una sede
app.get('/admin/inventory/:location_id', authenticate, async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { location_id } = req.params;

  try {
    const inventory = await pool.query(
      `SELECT products.*, inventory.quantity 
       FROM inventory 
       JOIN products ON inventory.product_id = products.id 
       WHERE inventory.location_id = $1`,
      [location_id]
    );

    const inventoryWithReorderStatus = inventory.rows.map(item => ({
      ...item,
      needs_reorder: item.quantity < item.reorder_level
    }));

    res.json(inventoryWithReorderStatus);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar inventario de una sede
app.put('/admin/inventory/:product_id/:location_id', authenticate, async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { product_id, location_id } = req.params;
  const { quantity } = req.body;

  try {
    const updatedInventory = await pool.query(
      `UPDATE inventory SET quantity = $1 WHERE product_id = $2 AND location_id = $3 RETURNING *`,
      [quantity, product_id, location_id]
    );
    res.json(updatedInventory.rows[0]);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Eliminar inventario de una sede
app.delete('/admin/inventory/:product_id/:location_id', authenticate, async (req, res) => {
  if (req.user.profile !== 'admin') {
    return res.status(403).json({ error: 'Access denied' });
  }

  const { product_id, location_id } = req.params;

  try {
    await pool.query('DELETE FROM inventory WHERE product_id = $1 AND location_id = $2', [product_id, location_id]);
    res.json({ message: 'Inventory item deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Búsqueda de productos por propiedades
app.get('/search/products', async (req, res) => {
  const { name, brand, min_price, max_price, category, supplier } = req.query;

  let query = `SELECT * FROM products WHERE 1=1`;
  const queryParams = [];

  if (name) {
    queryParams.push(`%${name}%`);
    query += ` AND name ILIKE $${queryParams.length}`;
  }

  if (brand) {
    queryParams.push(`%${brand}%`);
    query += ` AND brand ILIKE $${queryParams.length}`;
  }

  if (min_price) {
    queryParams.push(min_price);
    query += ` AND price >= $${queryParams.length}`;
  }

  if (max_price) {
    queryParams.push(max_price);
    query += ` AND price <= $${queryParams.length}`;
  }

  if (category) {
    queryParams.push(`%${category}%`);
    query += ` AND category ILIKE $${queryParams.length}`;
  }

  if (supplier) {
    queryParams.push(`%${supplier}%`);
    query += ` AND supplier ILIKE $${queryParams.length}`;
  }

  try {
    const products = await pool.query(query, queryParams);
    res.json(products.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
