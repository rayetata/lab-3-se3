import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/:orderId", async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `SELECT order_id, product_id, quantity, discount
       FROM order_item
       WHERE order_id = $1`,
      [orderId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching order items:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const { order_id, product_id, quantity, discount } = req.body;

    if (!order_id || !product_id) {
      res.status(400).json({
        message: "order_id and product_id are required",
      });
      return;
    }

    if (quantity === undefined || isNaN(Number(quantity))) {
      res.status(400).json({
        message: "quantity is required and must be a number",
      });
      return;
    }

    const result = await pool.query(
      `INSERT INTO order_item (order_id, product_id, quantity, discount)
       VALUES ($1, $2, $3, $4)
       RETURNING order_id, product_id, quantity, discount`,
      [order_id, product_id, quantity, discount ?? 0]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating order item:", error);

    const code = (error as { code?: string }).code;

    if (code === "23503") {
      res.status(400).json({
        message: "That order_id or product_id does not exist",
      });
      return;
    }

    if (code === "23505") {
      res.status(409).json({
        message: "That product is already on this order",
      });
      return;
    }

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default router;
