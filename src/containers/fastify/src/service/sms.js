const { Vonage } = require('@vonage/server-sdk');

const env = require('../config/env');

const createVonageClient = async () => {
	const vonageKey = await env.get('vonageKey');
	const vonageSecret = await env.get('vonageSecret');

	return new Vonage({
		apiKey: vonageKey,
		apiSecret: vonageSecret
	});
};

module.exports = { createVonageClient };
