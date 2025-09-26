const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

module.exports = ({ vonage, transporter, clients_password, clients_phone, clients_email, clients_method_2fa, code_tmp_2fa }) => {
    router.post('/up', async (req, res) => {
        const { login, password } = req.body;

        if (clients_password.has(login)) return res.status(400).json({ success: false, message: 'Utilisateur déjà inscrit' });

        const hashedPassword = await bcrypt.hash(password, 10);
        clients_password.set(login, hashedPassword);

        res.json({ success: true, message: 'Inscription réussie' });
    });

    router.post('/in', async (req, res) => {
        const { login, password } = req.body;
        const expected_password = clients_password.get(login);
        const method = clients_method_2fa.get(login);

        if (!clients_password.has(login)) return res.status(404).json({ success: false, message: 'Utilisateur inconnu' });

        const match = await bcrypt.compare(password, expected_password);
        if (!match) return res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
        
        try {
            if (method === 'sms') { // sms

                const code = Math.floor(100000 + Math.random() * 900000);

                const phone = clients_phone.get(login);
                const response = await vonage.sms.send({
                    to: phone,
                    from: '2FA-Test',
                    text: `Bonjour ${login}, votre code de vérification est ${code}`
                });

                code_tmp_2fa.set(phone, code);
                setTimeout(() => code_tmp_2fa.delete(phone), 5 * 60 * 1000);

            } else if (method === 'email') { // email

            const code = Math.floor(100000 + Math.random() * 900000);

            const email = clients_email.get(login);

            let info = await transporter.sendMail({
                from: 'Mon Site 👤 <fttranscendence03@gmail.com>',
                to: email,
                subject: 'Code de vérification 2FA',
                text: `Bonjour ${login}, votre code de vérification est : ${code}`,
                html: `<b>Bonjour ${login},</b><br>Votre code de vérification est : <strong>${code}</strong>`
            });

            code_tmp_2fa.set(email, code);
            setTimeout(() => code_tmp_2fa.delete(email), 5 * 60 * 1000);

            } else if (method === 'totp') { // totp
                ;
            } else
            return res.status(400).json({ success: false, message: 'Méthode 2FA non configurée pour cet utilisateur' });

            return res.json({ success: true, method, message: `Code de vérification envoyé par ${method}` }); 

        } catch (err) {
            console.error('Erreur serveur :', err.message);
            return res.status(500).json({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }

    });

  return router;
};