const express = require("express");
const axios = require("axios");
const crypto = require("crypto");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const router = require("./routes/payment.routes");

const app = express();
app.use(express.json());
app.use(cors());
const port = process.env.port || 4000;

app.use(bodyParser.json());
app.use("/api", router);

app.get("/", (req, res) => console.log("Hello World Shubham__&"));

app.listen(port, () => {
	console.log(`Example listening at http://localhost:${port} `);
});

