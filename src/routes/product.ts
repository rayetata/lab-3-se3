import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

//Get all products
router.get("/", async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    if (category) {
      const result = await pool.query(
      `SELECT product_id, product_name, category, unit_price FROM product WHERE category = $1`,
      [category]
      );
      return res.status(200).json(result.rows);
    }
    const result = await pool.query(
      "SELECT product_id, product_name, category, unit_price FROM product"
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching products:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
});

// Get one products by ID
router.get("/:id", async (req: Request, res: Response) => {
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
router.post("/", async (req: Request, res: Response) => {
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
      `INSERT INTO product
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
router.patch("/:id/price", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { unit_price } = req.body;

    if (unit_price === undefined) {
      return res.status(400).json({
        message: "unit_price is required",
      });
    }

    if (typeof unit_price !== "number" || unit_price < 0) {
      return res.status(400).json({
        message: "unit_price must be a valid positive number",
      });
    }

    const result = await pool.query(
      `UPDATE product
       SET unit_price = $1
       WHERE product_id = $2
       RETURNING product_id, product_name, unit_price`,
      [unit_price, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error updating product price:", error);

    res.status(400).json({
      message: "Unable to update product price",
    });
  }
});

//delete a product
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM product WHERE product_id = $1 RETURNING product_id",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    res.status(200).json({
      message: "product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);

    res.status(400).json({
      message:
        "Unable to delete product. The product may have existing orders.",
    });
  }
});

export default router;