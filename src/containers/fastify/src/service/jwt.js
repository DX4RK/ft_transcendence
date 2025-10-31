const jwt = require('jsonwebtoken');
const { jwtSecret } = require("../config/env");

function generateToken(payload, expiresIn = "7d") {
	return jwt.sign(payload, jwtSecret, { expiresIn });
}

function verifyToken(token) {
	try {
		const decoded = jwt.verify(token, jwtSecret);
		return { valid: true, decoded };
	} catch (err) {
		return { valid: false, err };
	}
}

module.exports = { generateToken, verifyToken };
