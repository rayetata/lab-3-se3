import express from "express";
import { pool } from "./db";
import customerRoutes from "./routes/customers";
import orderRoutes from "./routes/orders";
import productRoutes from "./routes/product";
import orderItemRoutes from "./routes/order-items";
import vendorRoutes from "./routes/vendors";
import supplyRoutes from "./routes/supplies";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "E-Commerce & Logistics API is running",
  });
});

app.use("/api/v1/customers", customerRoutes);
app.use("/api/v1/orders", orderRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/order-items", orderItemRoutes);
app.use("/api/v1/vendors", vendorRoutes);
app.use("/api/v1/supplies", supplyRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});