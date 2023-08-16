/*
Create an API on the back-end using Express and Express Router to allow for the creation of  a new inventory item attached to a given warehouse. All details should come from the front-end.

New data should be inserted into your database using knex.

All request body data needs to have validation. All values are required (non-empty). For incorrect/incomplete data, the correct error response needs to be sent (with status code and message).

POST /api/inventories

Request body example:

{
  "warehouse_id": "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
  "item_name": "Paper Towels",
  "description": "Made out of military-grade synthetic materials, these paper towels are highly flammable, yet water resistant, and easy to clean.",
  "category": "Gear",
  "status": "Out of Stock",
  "quantity": "0"
}

Response returns 400 if unsuccessful because of missing properties in the request body

Response returns 400 if the warehouse_id value does not exist in the warehouses table

Response returns 400 if the quantity is not a number

Response returns 201 if successful

Response body example: 

{
  "id": "71870fd2-ede3-4116-a5ca-632ae2aadc32",
  "warehouse_id": "bfc9bea7-66f1-44e9-879b-4d363a888eb4",
  "item_name": "Paper Towels",
  "description": "Made out of military-grade synthetic materials, these paper towels are highly flammable, yet water resistant, and easy to clean.",
  "category": "Gear",
  "status": "Out of Stock",
  "quantity": 0
}
*/

const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile").development);
const { warehouseExistsById } = require("../utils/warehouseExistsById");

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

module.exports = router;
