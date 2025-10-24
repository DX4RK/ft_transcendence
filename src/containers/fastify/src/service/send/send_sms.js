async function sendSMSCode(vonage, user, phone, code) {
	const info = await vonage.sms.send({
		to: phone,
		from: 'Vonage',
		text: `Hello ${user}, your verification code is ${code}`
	})

	return code;
}

module.exports = sendSMSCode;
