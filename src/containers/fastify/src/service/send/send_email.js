async function sendEmailCode(transporter, login, email, code_tmp_2fa) {

    const code = Math.floor(100000 + Math.random() * 900000);

    const info = await transporter.sendMail({
        from: 'Mon Site 👤 <fttranscendence03@gmail.com>',
        to: email,
        subject: 'Code de vérification 2FA',
        text: `Bonjour ${login}, votre code de vérification est : ${code}`,
        html: `<b>Bonjour ${login},</b><br>Votre code de vérification est : <strong>${code}</strong>`
    });

    code_tmp_2fa.set(email, code);
    setTimeout(() => code_tmp_2fa.delete(email), 5 * 60 * 1000);

    return info;
}

module.exports = sendEmailCode;
