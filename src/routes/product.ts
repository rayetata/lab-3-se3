import { Router } from "express";
import { pool } from "../db";

const router = Router();

//Get all products
router.get("/", async (req, res) => {
  try {
    const result =  await pool.query(
        "SELECT product_id, product_name, category, unit_price FROM product"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get one products by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT product_id, product_name, category, unit_price FROM product WHERE product_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching customer:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

//add a new product
router.post("/", async (req, res) => {
  try {
    const {
      product_id,
      product_name,
      category,
      unit_price,
    } = req.body;

    if (!product_id || !product_name) {
      return res.status(400).json({
        message: "product_id and product_name are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO customer
       (product_id, product_name, category, unit_price)
       VALUES ($1, $2, $3, $4)
       RETURNING product_id, product_name, category, unit_price`,
      [product_id, product_name, category, unit_price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating product:", error);

    res.status(400).json({
      message: "Unable to create product",
    });
  }
});

// Update a product
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { product_name, unit_price } = req.body;

    if (product_name === undefined && id === undefined) {
      return res.status(400).json({
        message: "product_name and id is required",
      });
    }

    const result = await pool.query(
      `UPDATE customer
       SET
         city = COALESCE($1, city),
         membership_level = COALESCE($2, membership_level)
       WHERE customer_id = $3
       RETURNING customer_id, customer_name, city, membership_level`,
      [city ?? null, membership_level ?? null, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating customer:", error);

    res.status(400).json({
      message: "Unable to update customer",
    });
  }
});

//Delete a customer
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM customer WHERE customer_id = $1 RETURNING customer_id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting customer:", error);

    res.status(400).json({
      message:
        "Unable to delete customer. The customer may have existing orders.",
    });
  }
});

export default router;