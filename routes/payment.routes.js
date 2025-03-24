const express = require("express");
const router = express.Router();

const {
	createOrder,
	veriFyPayment,
} = require("../controllers/payment.controller");

router.post("/createOrder", createOrder);
router.post("/verifyPayment", veriFyPayment);

module.exports = router;
