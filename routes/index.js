const knexConfig = require("../knexfile");
const knex = require("knex")(knexConfig.development);

const express = require("express");
const router = express.Router();

const warehousesRoutes = require("./warehouses");
router.use("/warehouses", warehousesRoutes);

const inventoriesRoutes = require("./inventories");
router.use("/inventories", inventoriesRoutes);

router.get("/", async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: "This is home!" });
});

module.exports = router;
