const express = require("express");
const app = express();
const PORT = 5000;

// Serve static files from "public" folder
app.use(express.static("public"));

// Unified products data
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

// Single API route
app.get("/api/products", (req, res) => {
  res.json(products);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
