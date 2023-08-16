const express = require('express');
const cors = require('cors');

require('dotenv').config();

const app = express();
const routes = require("./routes/index");

app.use(cors());
app.use(express.json());

app.use("/", routes);

const PORT = process.env.PORT ||5050;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
