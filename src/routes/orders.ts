import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

//Get all orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const result =  await pool.query(
        "SELECT orders_id, customer_id, order_date, shipping_city FROM orders"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get one orders by ID
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT order_id, customer_is, order_date, shipping_city  FROM orders WHERE order_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "orders not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching order:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

//add a new orders
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      order_id,
      customer_id,
      order_date,
      shipping_city,
    } = req.body;

    if (!order_id || !customer_id) {
      return res.status(400).json({
        message: "order_id and customer_id are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO orders (order_id, customer_id, order_date, shipping_city)
       VALUES ($1, $2, $3, $4)
       RETURNING order_id, customer_id, order_date, shipping_city`,
      [order_id, customer_id, order_date, shipping_city]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order:", error);

    res.status(400).json({
      message: "Unable to create order",
    });
  }
});

//delete a product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM orders WHERE order_id = $1 RETURNING order_id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "order not found",
      });
    }

    res.status(200).json({
      message: "order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);

    res.status(400).json({
      message:
        "Unable to delete order. The order may have existing orders.",
    });
  }
});

export default router;  