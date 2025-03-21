const { error } = require("console");
const { createRazorpayInstance } = require("../config/razorpay.config");
const crypto = require("crypto");
const axios = require("axios");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();

const MERCHANT_KEY = "e238dc05-4252-419e-acf0-759b6242cb90";
const MERCHANT_ID = "M227WH8T7N8HO";

// const MERCHANT_KEY = "96434309-7796-489d-8924-ab56988a6076";
// const MERCHANT_ID = "PGTESTPAYUAT86";

const MERCHANT_BASE_URL =
	"https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay";
const MERCHANT_BASE_URL_PROD = "https://api.phonepe.com/apis/hermes/pg/v1/pay";

const MERCHANT_STATUS_URL =
	"https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status";

const MERCHANT_STATUS_URL_PROD =
	"https://api.phonepe.com/apis/hermes/pg/v1/status";

const redirectUrl = "https://priykala-backend.vercel.app/api/status";

const successUrl = "https://priykala-backend.vercel.app/api/payment-success";
const failureUrl = "https://priykala-backend.vercel.app/api/payment-failure";

exports.createOrder = async (req, res) => {
	try {
		const { name, mobile, amount, transactionId, MUID } = req.body;
		console.log("TT", req.body);

		//payment
		const paymentPayload = {
			merchantId: MERCHANT_ID,
			merchantTransactionId: transactionId,
			merchantUserId: MUID,
			name: name,
			mobileNumber: mobile,
			amount: amount * 100,
			redirectUrl: `${redirectUrl}/${transactionId}`,
			redirectMode: "POST",
			paymentInstrument: {
				type: "PAY_PAGE",
			},
		};

		const payloadMain = Buffer.from(
			JSON.stringify(paymentPayload)
		).toString("base64");
		const keyIndex = 1;
		const string = payloadMain + "/pg/v1/pay" + MERCHANT_KEY;
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
				request: payloadMain,
			},
		};

		axios
			.request(option)
			.then((response) => {
				console.log("ORD", response.data);
				res.status(200).json({
					msg: "OK",
					url: response.data.data.instrumentResponse.redirectInfo.url,
					resp: response.data,
				});
				// return res.redirect(
				// 	response.data.data.instrumentResponse.redirectInfo.url
				// );
			})
		// res.status(200).json({
		// 	msg: "OK",
		// 	url: response.data.data.instrumentResponse.redirectInfo.url,
		// 	resp: response.data,
		// });
	} catch (error) {
		console.log("error in payment", error);
		res.status(500).json({ error: "Failed to initiate payment" });
	}
};

exports.veriFyPayment = async (req, res) => {
	console.log("STATUS", req.query);
	const merchantTransactionId = req.req.body.transactionId;
	const merchantId = res.req.body.merchantId;

	const keyIndex = 1;
	const string =
		`/pg/v1/status/${merchantId}/${merchantTransactionId}` + MERCHANT_KEY;
	const sha256 = crypto.createHash("sha256").update(string).digest("hex");
	const checksum = sha256 + "###" + keyIndex;

	const option = {
		method: "GET",
		url: `${MERCHANT_STATUS_URL_PROD}/${merchantId}/${merchantTransactionId}`,
		headers: {
			accept: "application/json",
			"Content-Type": "application/json",
			"X-VERIFY": checksum,
			"X-MERCHANT-ID": merchantId,
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
