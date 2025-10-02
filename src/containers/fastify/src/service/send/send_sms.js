async function sendSMSCode(vonage, login, phone, code_tmp_2fa) {

    const code = Math.floor(100000 + Math.random() * 900000);

    const response = await vonage.sms.send({
        to: phone,
        from: '2FA-Test',
        text: `Bonjour ${login}, votre code de vérification est : ${code}`
    });

    code_tmp_2fa.set(phone, code);
    setTimeout(() => code_tmp_2fa.delete(phone), 5 * 60 * 1000);

    return response;
}

module.exports = sendSMSCode;
