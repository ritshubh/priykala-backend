const { error } = require("console");
const { createRazorpayInstance } = require("../config/razorpay.config");
const crypto = require("crypto");
require("dotenv").config();

const razorpayInstance = createRazorpayInstance();

exports.createOrder = async (req, res) => {
	console.log(req.body);
	const { courseId, amount } = req.body;
	console.log("11", courseId, amount);

	if (!courseId || !amount) {
		return res.status(400).json({
			success: false,
			message: "course id or amount is required",
		});
	}

	const options = {
		amount: amount * 100, // Razorpay requires the amount in paise (i.e., multiplied by 100)
		currency: "INR",
		receipt: `receipt_order_1_3_sgther`,
	};

	try {
		console.log("aaa", options);

		// Await Razorpay order creation instead of using a callback
		const order = await razorpayInstance.orders.create(options);

		console.log(order);

		return res.status(200).json(order);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			success: false,
			message: "Something went wrong",
		});
	}
};

exports.veriFyPayment = async (req, res) => {
	console.log("VERUFY___$$");
	let d = new Date();
	let order_date = d.toLocaleString();
	let n = d.toISOString();
	let id = n.split(":")[0] + n.split(":")[1] + n.split(":")[2].slice(0, 6);
	let customerOrderId = id
		.replace(/-/g, "")
		.replace(".", "")
		.replace("T", "");
	res.send("Paymnent verify");
	const { order_id, payment_id, signature } = req.body;
	const secret = process.env.RAZORPAY_KEY_SECRET;
	console.log("VERIFY", req.body);
	const hmac = crypto.createHmac("sha256", secret);
	hmac.update(order_id + "|" + payment_id);
	const generateSignature = hmac.digest("hex");

	console.log("generateSignature", generateSignature);
	console.log("signature", req);
	if (generateSignature === signature) {
		return res.status(200).json({
			success: true,
			paymentDetails: { order_date, customerOrderId },
			message: "Payment Verified",
		});
	} else {
		console.log("GG", res);
		return res.status(400).json({
			success: false,
			message: "Payment not Verified",
		});
	}
};
