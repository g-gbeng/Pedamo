const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

// ✅ Middleware
app.use(express.static("public"));
app.use(bodyParser.json());

// ✅ Unified products data (now includes Pedamo Tea)
const products = [
  {
    name: "Sweet Roselle",
    description: "A rich sweet flavor for lovers of bold taste.",
    price: 8500,
    image: "/images/Sweet.jpg",
  },
  {
    name: "Mild Roselle",
    description: "Gentle and refreshing hibiscus blend.",
    price: 8000,
    image: "/images/Mild.jpg",
  },
  {
    name: "Hot Roselle",
    description: "A spicy twist with natural hibiscus tang.",
    price: 9000,
    image: "/images/Hot.jpg",
  },
  {
    name: "Semi-Sweet Roselle",
    description: "Balanced sweetness for every occasion.",
    price: 9000,
    image: "/images/SemiSweet.jpg",
  },
  // ✅ New Pedamo Tea product
  {
    name: "Pedamo Tea",
    description:
      "A refreshing and healthy tea blend made with the finest natural ingredients. Enjoy a soothing experience that revitalizes your mind and body.",
    price: 6500,
    image: "/images/Hot.jpg", // make sure Tea.jpg exists in public/images
  },
];

// ✅ Products endpoint
app.get("/api/products", (req, res) => {
  res.json(products);
});

// ✅ File paths for order logs
const ordersFile = path.join(__dirname, "orders.json");
const deletedOrdersFile = path.join(__dirname, "deleted_orders.json");

// ✅ Ensure order files exist
if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, "[]", "utf8");
if (!fs.existsSync(deletedOrdersFile)) fs.writeFileSync(deletedOrdersFile, "[]", "utf8");

// ✅ Helper functions
function readOrders() {
  try {
    const data = fs.readFileSync(ordersFile, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

function readDeletedOrders() {
  try {
    const data = fs.readFileSync(deletedOrdersFile, "utf8");
    return JSON.parse(data || "[]");
  } catch {
    return [];
  }
}

// ✅ Save new order
app.post("/api/orders", (req, res) => {
  try {
    const newOrder = req.body;
    const orders = readOrders();

    orders.push({
      ...newOrder,
      id: Date.now().toString(),
      status: "active",
      createdAt: new Date().toISOString(),
    });

    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");
    res.json({ message: "Order saved successfully!" });
  } catch (err) {
    res.status(500).json({ message: "Error saving order" });
  }
});

// ✅ Get all orders
app.get("/api/orders", (req, res) => {
  res.json(readOrders());
});

// ✅ Mark order as delivered
app.put("/api/orders/:id/deliver", (req, res) => {
  try {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Order not found" });

    orders[index].status = "delivered";
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");

    res.json({ message: "Order marked as delivered" });
  } catch (err) {
    res.status(500).json({ error: "Error updating order" });
  }
});

// ✅ Delete order and log it
app.delete("/api/orders/:id", (req, res) => {
  try {
    const orders = readOrders();
    const index = orders.findIndex(o => o.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: "Order not found" });

    const [deletedOrder] = orders.splice(index, 1);
    const deletedOrders = readDeletedOrders();

    deletedOrders.push({ ...deletedOrder, deletedAt: new Date().toISOString() });

    fs.writeFileSync(deletedOrdersFile, JSON.stringify(deletedOrders, null, 2), "utf8");
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2), "utf8");

    res.json({ message: "Order deleted successfully and logged" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting order" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
