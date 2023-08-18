const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile").development);

router.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT || 8080;

const { isValidEmail, isValidPhoneNumber } = require("../utils/isValid");

router.get("/", async (_req, res) => {
  try {
    const warehouses = await knex("warehouses");

    res.status(200).json(warehouses);
  } catch (error) {
    console.error("Error retrieving warehouses", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    } = req.body;

    if (
      !warehouse_name ||
      !address ||
      !city ||
      !country ||
      !contact_name ||
      !contact_position ||
      !contact_phone ||
      !contact_email
    ) {
      return res.status(400).json({ error: "All fields are required!" });
    } else if (
      !isValidEmail(contact_email) ||
      !isValidPhoneNumber(contact_phone)
    ) {
      return res
        .status(400)
        .json({ error: "Invalid email address or phone number!" });
    } else {
      const [newWarehouseId] = await knex("warehouses").insert({
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email,
      });
      res.status(201).json({
        id: newWarehouseId,
        warehouse_name: warehouse_name,
        address: address,
        city: city,
        country: country,
        contact_name: contact_name,
        contact_position: contact_position,
        contact_phone: contact_phone,
        contact_email: contact_email,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;

  const {
    warehouse_name,
    address,
    city,
    country,
    contact_name,
    contact_position,
    contact_phone,
    contact_email,
  } = req.body;

  if (
    !warehouse_name ||
    !address ||
    !city ||
    !country ||
    !contact_name ||
    !contact_position ||
    !contact_phone ||
    !contact_email
  ) {
    return res.status(400).json({
      message: "All values are required.",
    });
  }
  try {
    const updatedRows = await knex("warehouses").where({ id }).update({
      warehouse_name,
      address,
      city,
      country,
      contact_name,
      contact_position,
      contact_phone,
      contact_email,
    });

    if (updatedRows === 0) {
      return res.status(404).json({ message: "Warehouse ID not found." });
    }

    const updatedWarehouse = await knex("warehouses").where({ id }).first();
    return res.status(200).json(updatedWarehouse);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Failed to update warehouse details." });
  }
});

router.get("/:id", async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const warehouse = await knex("warehouses").where("id", warehouseId).first();

    if (!warehouse) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    const warehouseInvetory = await knex("inventories")
      .select("item_name", "category", "status", "quantity", "id")
      .where("warehouse_id", warehouseId);

    if (!warehouseInvetory) {
      return res.status(404).json({ error: "Warehouse not found" });
    }

    const warehouseDataById = { ...warehouse, inventory: warehouseInvetory };
    res.status(200).json(warehouseDataById);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  const warehouseId = req.params.id;

  try {
    const result = await knex("warehouses").where({ id: req.params.id }).del();

    if (result === 0) {
      return res.status(400).json({
        message: `Warehouse with ID: ${req.params.id} to be deleted not found.`,
      });
    }

    res.status(204).send();
  } catch (error) {
    console.error("Error deleting warehouse", error);
    res.status(500).json({ message: "Unable to delete user" });
  }
});

module.exports = router;
