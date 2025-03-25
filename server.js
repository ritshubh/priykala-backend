const express = require("express");
const cors = require("cors");
const router = require("./routes/payment.routes");
const bodyParser = require("body-parser");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.port || 4000;

app.use(bodyParser.json());
app.use("/api", router);
app.get("/", (req, res) => console.log("Hello World shubh"));

app.listen(port, () => {
	console.log(`Example listening at http://localhost:${port} `);
});
