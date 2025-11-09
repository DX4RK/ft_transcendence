const nodemailer = require('nodemailer');
const env = require("../config/env");

const createEmailTransporter = async () => {
	const gmailUser = await env.get('gmailUser');
	const gmailPass = await env.get('gmailPass');
	
	return nodemailer.createTransport({
		service: 'gmail',
		auth: {
			user: gmailUser,
			pass: gmailPass
		}
	});
};

module.exports = { createEmailTransporter };
