import { Router } from "express";
import { pool } from "../db";

const router = Router();

//Get all customers
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT customer_id, customer_name, city, membership_level FROM customer"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching customers:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get one customer by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(
      "SELECT customer_id, customer_name, city, membership_level FROM customer WHERE customer_id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Customer not found",
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

//Create a new customer
router.post("/", async (req, res) => {
  try {
    const {
      customer_id,
      customer_name,
      city,
      membership_level,
    } = req.body;

    if (!customer_id || !customer_name) {
      return res.status(400).json({
        message: "customer_id and customer_name are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO customer
       (customer_id, customer_name, city, membership_level)
       VALUES ($1, $2, $3, $4)
       RETURNING customer_id, customer_name, city, membership_level`,
      [customer_id, customer_name, city, membership_level]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating customer:", error);

    res.status(400).json({
      message: "Unable to create customer",
    });
  }
});

// Update a Customer
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { city, membership_level } = req.body;

    if (city === undefined && membership_level === undefined) {
      return res.status(400).json({
        message: "city or membership_level is required",
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