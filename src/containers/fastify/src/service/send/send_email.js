async function sendEmailCode(transporter, user, email, code) {
	const info = await transporter.sendMail({
		from: 'ft_transcendence <fttranscendence03@gmail.com>',
		to: email,
		subject: 'Verification Code',
		text: `Hello ${user}, your verification code is ${code}`,
		html: `<b>Hello ${user},</b><br>your verification code is <strong>${code}</strong>`
	});

	return code;
}

module.exports = sendEmailCode;
