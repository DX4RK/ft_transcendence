async function sendSMSCode(vonage, user, phone, code) {

	const from = "Transcendence";
	const to = phone;
	const text = `Hello ${user}, your verification code is ${code}`;

	await vonage.sms.send({to, from, text})
		.then(resp => { console.log('Message sent successfully'); console.log(resp); })
		.catch(err => { console.log('There was an error sending the messages.'); console.error(err); });

	return code;
}

module.exports = sendSMSCode;
