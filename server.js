const express = require('express');
const cors = require('cors');
const knex = require('knex');
const knexConfig = require('./knexfile');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const warehouseRoutes = require('./routes/warehouses');

app.use('/api/warehouses', warehouseRoutes);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
