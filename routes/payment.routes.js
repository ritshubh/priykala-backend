const express = require("express");
const router = express.Router();

const {
	createOrder,
	veriFyPayment,
} = require("../controllers/payment.controller");

router.post("/createOrder", createOrder);
router.post("/status/:txnId", veriFyPayment);

module.exports = router;
