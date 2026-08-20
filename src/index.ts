import express from "express";
import { pool } from "./db";
import customerRoutes from "./routes/customers";
import productRoutes from "./routes/product";
import ordersRoutes from "./routes/orders";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce & Logistics API is running",
  });
});

app.get("/api/v1/products", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM product");

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/orders", ordersRoutes);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});