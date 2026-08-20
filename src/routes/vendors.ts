import { Router } from "express";
import { pool } from "../db";

const router = Router();

router.get("/", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT vendor_id, vendor_name, city FROM vendor"
        );

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching vendors:", error);

        res.status(500).json({
            message: "Internal server error",
        });
    }
});

export default router;
