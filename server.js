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

app.get("/", (req, res) => console.log("Hello World Shubham__"));

app.listen(port, () => {
	console.log(`Example listening at http://localhost:${port} `);
});

//priykala cred
// const MERCHANT_KEY = "e238dc05-4252-419e-acf0-759b6242cb90";
// const MERCHANT_ID = "M227WH8T7N8HO";

// const MERCHANT_BASE_URL =
// 	"https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
// const MERCHANT_BASE_URL_PROD = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

// const MERCHANT_STATUS_URL =
// 	"https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";
// const MERCHANT_STATUS_URL_PROD =
// 	"https://api.phonepe.com/apis/hermes/pg/v1/status";

// const redirectUrl = "http://localhost:4000/status";

// const successUrl = "http://localhost:5173/payment-success";
// const failureUrl = "http://localhost:5173/payment-failure";
