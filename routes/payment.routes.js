const express = require("express");
const router = express.Router();

const {
	createOrder,
	veriFyPayment,
} = require("../controllers/payment.controller");

router.post("/create-order", createOrder);
router.post("/status", veriFyPayment);

module.exports = router;
