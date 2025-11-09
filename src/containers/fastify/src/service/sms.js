const { Vonage } = require('@vonage/server-sdk');

const { get } = require('../config/env');
const vonageKey = get('vonageKey');
const vonageSecret = get('vonageSecret');

const createVonageClient = () => {
	return new Vonage({
		apiKey: vonageKey,
		apiSecret: vonageSecret
	});
};

module.exports = { createVonageClient };
