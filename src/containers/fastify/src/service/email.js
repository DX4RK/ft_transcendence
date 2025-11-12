const nodemailer = require('nodemailer');

const { get } = require('../config/env');

async function createEmailTransporter() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: await get('gmailUser'),
			pass: await get('gmailPass')
		}
	});
}

module.exports = { createEmailTransporter };
