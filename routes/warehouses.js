const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile").development);

const cors = require("cors");

router.use(cors());
router.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT || 8080;

router.get("/", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "This is warehouses!" });
});

router.get("/:id", async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouse = await knex("warehouses")
      .select("*")
      .where("id", warehouseId)
      .first();

    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    res.status(200).json(warehouse);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;