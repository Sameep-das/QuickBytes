const express = require("express");
const cors = require("cors");
const mysql = require("mysql2/promise"); 

// import db_details from './db.js';
const db_details = require("./db");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Create the connection pool
const pool = mysql.createPool({
  host: db_details.host,
  user: db_details.user,
  password: db_details.password,
  database: db_details.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Test database connection
(async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Connected to MySQL");
    connection.release();
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
  }
})();

//  User Signup
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please fill all fields." });
  }

  try {
    const [existingUser] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    await pool.query("INSERT INTO users (name, email, password) VALUES (?, ?, ?)", [name, email, password]);
    res.status(200).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

//  User Signin
app.post("/signin", async (req, res) => {
  const { email, password } = req.body;

  try {
    const [userResults] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (userResults.length && userResults[0].password === password) {
      return res.status(200).json({
        role: "user",
        id: userResults[0].id,
        name: userResults[0].name,
        email: userResults[0].email,
      });
    }

    const [restResults] = await pool.query("SELECT * FROM restaurants WHERE email = ?", [email]);

    if (restResults.length && restResults[0].password === password) {
      return res.status(200).json({
        role: "restaurant",
        id: restResults[0].id,
        name: restResults[0].restaurant_name,
        email: restResults[0].email,
      });
    }

    return res.status(401).json({ message: "Invalid credentials" });

  } catch (err) {
    console.error("❌ Signin error:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
});

//  Get Restaurants by City
app.get("/restaurants", async (req, res) => {
  const { city } = req.query;

  if (!city) {
    return res.status(400).json({ message: "City is required" });
  }

  try {
    const [results] = await pool.query(
      "SELECT id, restaurant_name, owner_name, email, location FROM restaurants WHERE location = ?",
      [city]
    );
    res.json(results);
  } catch (err) {
    console.error("DB Error (restaurants):", err);
    res.status(500).json({ message: "Database error" });
  }
});

// Get Restaurant Menu
app.get("/restaurant-menu/:id", async (req, res) => {
  const restaurantId = req.params.id;

  try {
    const [results] = await pool.query(
      "SELECT item_name, item_price FROM restaurant_menu WHERE restaurant_id = ?",
      [restaurantId]
    );
    res.json(results);
  } catch (err) {
    console.error("🚨 SQL Error:", err.message);
    res.status(500).json({ message: "Database error" });
  }
});

//  Save User Order Details
app.post("/save-user-details", async (req, res) => {
  const { userId, buildingNo, streetName, city, zipCode, contact } = req.body;

  if (!userId || !buildingNo || !streetName || !city || !zipCode || !contact) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    await pool.query(
      `INSERT INTO user_details (user_id, building_no, street_name, city, zip_code, contact) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, buildingNo, streetName, city, zipCode, contact]
    );
    res.status(200).json({ message: "User details saved successfully" });
  } catch (err) {
    console.error("Error saving user details:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// ✅ Restaurant Signup
app.post("/restaurant-signup", async (req, res) => {
  const { restaurant_name, owner_name, email, location, password } = req.body;

  if (!restaurant_name || !owner_name || !email || !location || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const [existing] = await pool.query("SELECT * FROM restaurants WHERE email = ?", [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: "Email already exists." });
    }

    const [result] = await pool.query(
      `INSERT INTO restaurants (restaurant_name, owner_name, email, location, password) VALUES (?, ?, ?, ?, ?)`,
      [restaurant_name, owner_name, email, location, password]
    );

    res.status(200).json({ message: "Restaurant registered", restaurantId: result.insertId });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ message: "Database error", error: err.message });
  }
});

// ✅ Save Menu Items
app.post("/restaurant-menu", async (req, res) => {
  const { restaurantId, menuItems } = req.body;

  if (!restaurantId || !Array.isArray(menuItems)) {
    return res.status(400).json({ message: "Invalid request" });
  }

  const values = menuItems.map((item) => [restaurantId, item.name, item.price]);

  try {
    await pool.query(
      `INSERT INTO restaurant_menu (restaurant_id, item_name, item_price) VALUES ?`,
      [values]
    );
    res.status(200).json({ message: "Menu saved successfully" });
  } catch (err) {
    console.error("Error inserting menu:", err);
    res.status(500).json({ message: "Database error" });
  }
});

// ✅ Get Single Restaurant by ID (NEW for Dashboard)
app.get("/restaurant/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.query(
      "SELECT id, restaurant_name, owner_name, location FROM restaurants WHERE id = ?",
      [id]
    );

    if (rows.length > 0) {
      res.json(rows[0]);
    } else {
      res.status(404).json({ message: "Restaurant not found" });
    }
  } catch (err) {
    console.error("Fetch restaurant error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// POST /orders
app.post('/orders', async (req, res) => {
  console.log('Received order request:', JSON.stringify(req.body, null, 2));
  
  const connection = await pool.getConnection();
  try {
    const { userId, restaurantId, totalAmount, items } = req.body;

    // Log received data
    console.log('Parsed order data:', {
      userId: typeof userId === 'number' ? userId : 'invalid',
      restaurantId: typeof restaurantId === 'number' ? restaurantId : 'invalid',
      totalAmount: typeof totalAmount === 'number' ? totalAmount : 'invalid',
      itemsCount: Array.isArray(items) ? items.length : 'invalid'
    });

    // Validate required fields and types
    if (!userId || typeof userId !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing userId',
        received: userId
      });
    }

    if (!restaurantId || typeof restaurantId !== 'number') {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing restaurantId',
        received: restaurantId
      });
    }

    if (!totalAmount || typeof totalAmount !== 'number' || totalAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing totalAmount',
        received: totalAmount
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or missing items array',
        received: items
      });
    }

    // Validate each item
    for (const item of items) {
      if (!item.item_name || typeof item.item_name !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing item_name',
          item
        });
      }

      if (!item.quantity || typeof item.quantity !== 'number' || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid or missing quantity',
          item
        });
      }

      // Price can be 0 but must be a number
      if (typeof item.price !== 'number') {
        return res.status(400).json({
          success: false,
          message: 'Invalid price format',
          item
        });
      }
    }

    await connection.beginTransaction();
    console.log('Transaction started');
    
    // Insert into orders table
    const [orderResult] = await connection.query(
      'INSERT INTO orders (user_id, restaurant_id, total_amount, status) VALUES (?, ?, ?, ?)',
      [userId, restaurantId, totalAmount, 'pending']
    );
    
    const orderId = orderResult.insertId;
    console.log('Order created with ID:', orderId, 'Status: pending', 'Total Amount:', totalAmount);
    
    // Insert order items
    for (const item of items) {
      console.log('Processing item:', item);
      const itemPrice = parseFloat(item.price);
      if (isNaN(itemPrice)) {
        console.error('Invalid price for item:', item);
        throw new Error(`Invalid price for item: ${item.item_name}`);
      }
      
      const [itemResult] = await connection.query(
        'INSERT INTO order_items (order_id, item_name, quantity, price) VALUES (?, ?, ?, ?)',
        [orderId, item.item_name, item.quantity, itemPrice]
      );
      console.log('Inserted item:', {
        order_id: orderId,
        item_name: item.item_name,
        quantity: item.quantity,
        price: itemPrice,
        total: itemPrice * item.quantity
      });
    }

    await connection.commit();
    console.log('Transaction committed successfully');

    // Set up auto-delivery after commit
    setTimeout(async () => {
      const deliveryConnection = await pool.getConnection();
      try {
        const [result] = await deliveryConnection.query(
          'UPDATE orders SET status = ?, delivery_date = NOW() WHERE id = ? AND status = ?',
          ['delivered', orderId, 'pending']
        );
        if (result.affectedRows > 0) {
          console.log('Order marked as delivered:', orderId);
        } else {
          console.log('Order status not updated - may have been cancelled:', orderId);
        }
      } catch (error) {
        console.error('Error updating order status to delivered:', error);
      } finally {
        deliveryConnection.release();
      }
    }, 120000); // 2 minutes timeout

    res.json({ 
      success: true, 
      message: 'Order placed successfully', 
      orderId,
      status: 'pending'
    });

  } catch (error) {
    await connection.rollback();
    console.error('Error creating order:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Error creating order',
      error: error.message,
      stack: error.stack
    });
  } finally {
    connection.release();
  }
});

// GET /orders/:userId
app.get('/orders/:userId', async (req, res) => {
  try {
    const [orders] = await pool.query(
      `SELECT o.*, oi.* 
       FROM orders o 
       LEFT JOIN order_items oi ON o.id = oi.order_id 
       WHERE o.user_id = ? 
       ORDER BY o.order_date DESC`,
      [req.params.userId]
    );

    // Group items by order
    const formattedOrders = orders.reduce((acc, curr) => {
      const order = acc.find(o => o.id === curr.order_id);
      if (order) {
        order.items.push({
          item_name: curr.item_name,
          quantity: curr.quantity,
          price: curr.price
        });
      } else {
        acc.push({
          id: curr.id,
          status: curr.status,
          total_amount: curr.total_amount,
          order_date: curr.order_date,
          delivery_date: curr.delivery_date,
          items: [{
            item_name: curr.item_name,
            quantity: curr.quantity,
            price: curr.price
          }]
        });
      }
      return acc;
    }, []);

    res.json(formattedOrders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PUT /orders/:orderId/cancel
app.put('/orders/:orderId/cancel', async (req, res) => {
  try {
    console.log('Attempting to cancel order:', req.params.orderId);
    const [result] = await pool.query(
      'UPDATE orders SET status = ? WHERE id = ? AND (status = ? OR status = ?)',
      ['cancelled', req.params.orderId, 'pending', 'confirmed']
    );
    
    if (result.affectedRows > 0) {
      console.log('Order cancelled successfully:', req.params.orderId);
      res.json({ 
        success: true, 
        message: 'Order cancelled successfully',
        status: 'cancelled'
      });
    } else {
      console.log('Order not found or not in cancellable status:', req.params.orderId);
      res.status(400).json({ 
        success: false, 
        error: 'Order cannot be cancelled - it may have already been delivered or cancelled' 
      });
    }
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Failed to cancel order' });
  }
});

// ✅ Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
