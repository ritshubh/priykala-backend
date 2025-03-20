const { error } = require("console");
const { createRazorpayInstance } = require("../config/razorpay.config");
const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const MERCHANT_KEY = "53201aea-9942-482f-952a-7bc6c6102453";
const MERCHANT_ID = "MERCHANTUAT";

// const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
// const MERCHANT_ID = "PGTESTPAYUAT86";

const MERCHANT_BASE_URL =
	"https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_BASE_URL_PROD = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

const MERCHANT_STATUS_URL =
	"https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const MERCHANT_STATUS_URL_PROD =
	"https://api.phonepe.com/apis/hermes/pg/v1/status";

// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/pay"
// const prod_URL = "https://api.phonepe.com/apis/hermes/pg/v1/status"

const redirectUrl = "https://priykala-backend.vercel.app/api/status";

const successUrl = "http://localhost:4000/payment-success";
const failureUrl = "http://localhost:4000/payment-failure";

exports.createOrder = async (req, res) => {
	const { name, mobile, amount, transactionId, MUID } = req.body;
	console.log("TT", req.body);

	//payment
	const paymentPayload = {
		merchantId: MERCHANT_ID,
		merchantUserId: name,
		mobileNumber: mobile,
		amount: amount * 100,
		merchantTransactionId: transactionId,
		redirectUrl: `${redirectUrl}/?id=${transactionId}`,
		redirectMode: "POST",
		paymentInstrument: {
			type: "PAY_PAGE",
		},
	};

	const payload = Buffer.from(JSON.stringify(paymentPayload)).toString(
		"base64"
	);
	const keyIndex = 1;
	const string = payload + "/pg/v1/pay" + MERCHANT_KEY;
	const sha256 = crypto.createHash("sha256").update(string).digest("hex");
	const checksum = sha256 + "###" + keyIndex;

	const option = {
		method: "POST",
		url: MERCHANT_BASE_URL_PROD,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": checksum,
		},
		data: {
			request: payload,
		},
	};
	try {
		const response = await axios.request(option);
		console.log(
			"ORD",
			response.data.data.instrumentResponse.redirectInfo.url
		);
		res.status(200).json({
			msg: "OK",
			url: response.data.data.instrumentResponse.redirectInfo.url,
			resp: response.data,
		});
	} catch (error) {
		console.log("error in payment", error);
		res.status(500).json({ error: "Failed to initiate payment" });
	}
};

exports.veriFyPayment = async (req, res) => {
	const merchantTransactionId = req.query.id;
	console.log("STATUS", req.query);

	const keyIndex = 1;
	const string =
		`/pg/v1/status/${MERCHANT_ID}/${merchantTransactionId}` + MERCHANT_KEY;
	const sha256 = crypto.createHash("sha256").update(string).digest("hex");
	const checksum = sha256 + "###" + keyIndex;

	const option = {
		method: "GET",
		url: `${MERCHANT_STATUS_URL_PROD}/${MERCHANT_ID}/${merchantTransactionId}`,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": checksum,
			"X-MERCHANT-ID": MERCHANT_ID,
		},
	};

	axios.request(option).then((response) => {
		if (response.data.success === true) {
			// Return success status
			res.status(200).json({
				status: "success",
				message: "Payment Verified",
			});
			return res.redirect(successUrl);
		} else {
			// Return failure status
			res.status(200).json({
				status: "failure",
				message: "Payment Verification Failed",
			});
			return res.redirect(failureUrl);
		}
	});
};
