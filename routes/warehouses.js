const express = require('express');
const router = express.Router();


const knex = require("knex")(require("../knexfile").development);

router.use(express.json());

require("dotenv").config();
const PORT = process.env.PORT || 8080;

router.get("/", async (_req, res) => {
  
  try {
    const warehouses = await knex("warehouses")

      res.status(200).json(warehouses);
    } catch (error) {
      console.error('Error retrieving warehouses', error);
      res.status(500).json({ error: "Internal server error" });
    }

router.put('/:id', async (req, res) => {
    const { id } = req.params;

    const {
        warehouse_name,
        address,
        city,
        country,
        contact_name,
        contact_position,
        contact_phone,
        contact_email
    } = req.body;

    if (!warehouse_name || !address || !city || !country || !contact_name || !contact_position || !contact_phone || !contact_email) {
        return res.status(400).json({
            message: 'All values are required.'
        });
    }
    try {
        const knexapp = knex({
          client: 'mysql2',
          connection: {
            database: process.env.DB_LOCAL_DBNAME,
            user: process.env.DB_LOCAL_USER,
            password: process.env.DB_LOCAL_PASSWORD,
          },
          migrations: {
            tableName: 'knex_migrations',
            directory: './DB_Setup/migrations',
          },
          seeds: {
            directory: './DB_Setup/seeds',
          },
        });
    
        const updatedRows = await knexapp('warehouses')
          .where({ id })
          .update({
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
          return res.status(404).json({ message: 'Warehouse ID not found.' });
        }
    
        const updatedWarehouse = await knexapp('warehouses').where({ id }).first();
        return res.status(200).json(updatedWarehouse);
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Failed to update warehouse details.' });
      }
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
