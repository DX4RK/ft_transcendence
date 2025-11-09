const jwt = require('jsonwebtoken');

const { jwtSecret } = require('../config/env');

async function generateToken(payload, expiresIn = "7d") {
	return jwt.sign(payload, jwtSecret, { expiresIn });
}

async function verifyToken(token) {
	try {
		const decoded = jwt.verify(token, jwtSecret);
		return { valid: true, decoded };
	} catch (err) {
		return { valid: false, err };
	}
}

module.exports = { generateToken, verifyToken };
