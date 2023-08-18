const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile").development);
const { warehouseExistsById } = require("../utils/warehouseExistsById");
const { inventoryExistsById } = require("../utils/inventoryExistsById");

router.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT || 8080;

router.get("/", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "This is inventories!" });
});

router.post("/", async (req, res) => {
  try {
    const { warehouse_id, item_name, description, category, status, quantity } =
      req.body;

    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status ||
      !quantity
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    } else if (isNaN(quantity)) {
      return res.status(400).json({ error: "Quantity is not a number! " });
    } else if (!(await warehouseExistsById(warehouse_id))) {
      return res
        .status(400)
        .json({ error: "Warehouse does not exist in the database!" });
    } else {
      const [newItemId] = await knex("inventories").insert({
        warehouse_id,
        item_name,
        description,
        category,
        status,
        quantity: Number(quantity),
      });
      res.status(201).json({
        id: newItemId,
        warehouse_id: warehouse_id,
        item_name: item_name,
        description: description,
        category: category,
        status: status,
        quantity: Number(quantity),
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/:id", async (req, res) => {
  const inventoryId = req.params.id;
  try {
    const inventory = await knex("inventories")
      .where("id", inventoryId)
      .first();

    if (!inventory) {
      return res.status(404).json({ error: "Inventory Item not found" });
    }

    res.status(200).json(inventory);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    if (!(await inventoryExistsById(id))) {
      res.status(404).json({ error: "Inventory ID not found!" });
    } else {
      const rowsAffected = await knex("inventories").where("id", id).delete();
      if (rowsAffected === 0)
        throw new Error(`Failed to delete inventory ID ${id}`);
      else res.sendStatus(204);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.put("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const { warehouse_id, item_name, description, category, status } = req.body;

    const inventory = await knex("inventories")
      .where({ id })
      .first();
        if (!inventory) {
          return res.status(404).json({
            error: "Inventory ID not found",
          });
        }

    if (
      !warehouse_id ||
      !item_name ||
      !description ||
      !category ||
      !status
    ) {
      return res.status(400).json({
        error: "All fields are required!",
      });
    }

    const existWarehouse = await knex('warehouses')
      .where({ id: warehouse_id })
      .first()
        if (!existWarehouse) {
          return res.status(400).json({
            error: "Warehouse does not exist in the database!",
          });
        }

    await knex("inventories")
      .where({ id })
      .update({
        warehouse_id,
        item_name,
        description,
        category,
        status
      });

    const updateInventory = await knex("inventories")
      .where({ id })
      .first();

    res.status(200).json(updateInventory);
  } catch(error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
