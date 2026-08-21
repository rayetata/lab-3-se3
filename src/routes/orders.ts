import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

//Get all orders
router.get("/", async (req: Request, res: Response) => {
  try {
    const result =  await pool.query(
        "SELECT order_id, customer_id, order_date::text AS order_date, shipping_city FROM orders"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching orders:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get order by customer ID
router.get("/customer/:customerId", async (req: Request, res: Response) => {
  try {
    const { customerId } = req.params;

    const result = await pool.query(
      "SELECT order_id, customer_id, order_date::text AS order_date, shipping_city FROM orders WHERE customer_id = $1",
      [customerId]
    );

    res.status(200).json(result.rows);
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
       RETURNING order_id, customer_id, order_date::text AS order_date, shipping_city`,
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

//delete an order
router.delete("/:id", async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    const { id } = req.params;

    await client.query("BEGIN");

    const existing = await client.query(
      "SELECT order_id FROM orders WHERE order_id = $1",
      [id]
    );

    if (existing.rows.length === 0) {
      await client.query("ROLLBACK");

      return res.status(404).json({
        message: "order not found",
      });
    }

    await client.query("DELETE FROM order_item WHERE order_id = $1", [id]);
    await client.query("DELETE FROM orders WHERE order_id = $1", [id]);

    await client.query("COMMIT");

    res.status(200).json({
      message: "order deleted successfully",
    });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});

    console.error("Error deleting order:", error);

    res.status(400).json({
      message: "Unable to delete order",
    });
  } finally {
    client.release();
  }
});

export default router;
