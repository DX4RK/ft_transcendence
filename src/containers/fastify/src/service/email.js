const nodemailer = require('nodemailer');

const { gmailUser, gmailPass } = require('../config/env');

async function createEmailTransporter() {
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: gmailUser,
			pass: gmailPass
		}
	});
}

module.exports = { createEmailTransporter };
