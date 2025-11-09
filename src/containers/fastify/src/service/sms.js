const { Vonage } = require('@vonage/server-sdk');

const { vonageKey, vonageSecret } = require('../config/env');

const createVonageClient = () => {
	return new Vonage({
		apiKey: vonageKey,
		apiSecret: vonageSecret
	});
};

module.exports = { createVonageClient };
