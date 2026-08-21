import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/vendor/:vendorId", async (req, res) => {
    try {
        const { vendorId } = req.params;

        const result = await pool.query(
            `SELECT vendor_id, product_id, stock_quantity
             FROM supplies
             WHERE vendor_id = $1`,
            [vendorId]
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching supplies:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});

router.put("/:vendorId/:productId", async (req, res) => {
    try {
        const { vendorId, productId } = req.params;
        const { stock_quantity } = req.body;

        if (stock_quantity === undefined || isNaN(Number(stock_quantity))) {
            res.status(400).json({
                message: "stock_quantity is required and must be a number",
            });
            return;
        }

        const result = await pool.query(
            `UPDATE supplies
             SET stock_quantity = $1
             WHERE vendor_id = $2 AND product_id = $3
             RETURNING vendor_id, product_id, stock_quantity`,
            [stock_quantity, vendorId, productId]
        );

        if (result.rows.length === 0) {
            res.status(404).json({
                message: "Supply record not found",
            });
            return;
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error("Error updating supply:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default router;
