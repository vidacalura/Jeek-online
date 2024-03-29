require("dotenv").config();
const routes = require("./routes/routes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors({ origin: "*" }));
app.use("/api", routes);

app.listen(process.env.PORT);