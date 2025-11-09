const jwt = require('jsonwebtoken');
const env = require("../config/env");

async function generateToken(payload, expiresIn = "7d") {
	const jwtSecret = await env.get('jwtSecret');
	return jwt.sign(payload, jwtSecret, { expiresIn });
}

async function verifyToken(token) {
	try {
		const jwtSecret = await get('jwtSecret');
		const decoded = jwt.verify(token, jwtSecret);
		return { valid: true, decoded };
	} catch (err) {
		return { valid: false, err };
	}
}

module.exports = { generateToken, verifyToken };
