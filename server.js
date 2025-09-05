const express = require("express");
const basicAuth = require("express-basic-auth");
const path = require("path");
require("dotenv").config();
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.static("public"));

// Products data
const products = [
  {
    name: "Sweet Roselle",
    description: "A rich sweet flavor for lovers of bold taste.",
    price: 8500,
    image: "/images/Pedamo 2.jfif",
  },
  {
    name: "Mild Roselle",
    description: "Gentle and refreshing hibiscus blend.",
    price: 8000,
    image: "/images/Pedamo 2.jfif",
  },
  {
    name: "Hot Roselle",
    description: "A spicy twist with natural hibiscus tang.",
    price: 9000,
    image: "/images/Pedamo 2.jfif",
  },
  {
    name: "Semi-Sweet Roselle",
    description: "Balanced sweetness for every occasion.",
    price: 9000,
    image: "/images/Pedamo 2.jfif",
  },
];

// Products API
app.get("/api/products", (req, res) => {
  res.json(products);
});

// Orders API
const ordersFile = path.join(__dirname, "orders.json");

// Save order (public - customers can post orders)
app.post("/api/orders", (req, res) => {
  let orders = [];
  if (fs.existsSync(ordersFile)) {
    orders = JSON.parse(fs.readFileSync(ordersFile));
  }

  const newOrder = { ...req.body, id: Date.now(), status: "Pending" };
  orders.push(newOrder);

  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

  res.json({ message: "Order placed successfully", order: newOrder });
});

// Get all orders (protected - admin only)
app.get(
  "/api/orders",
  basicAuth({
    users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
    challenge: true,
  }),
  (req, res) => {
    if (fs.existsSync(ordersFile)) {
      const orders = JSON.parse(fs.readFileSync(ordersFile));
      res.json(orders);
    } else {
      res.json([]);
    }
  }
);

// Protect the admin page (orders.html)
app.get(
  "/orders.html",
  basicAuth({
    users: { [process.env.ADMIN_USER]: process.env.ADMIN_PASS },
    challenge: true,
  }),
  (req, res) => {
    res.sendFile(path.join(__dirname, "public", "orders.html"));
  }
);

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
