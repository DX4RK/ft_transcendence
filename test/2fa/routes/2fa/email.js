const express = require('express');
const router = express.Router();

module.exports = ({ transporter, clients_email, clients_method_2fa, code_tmp_2fa, generateToken }) => {
    router.post('/send', async (req, res) => {
        const { login, email } = req.body;

        if (!login) return res.status(400).json({ success:false, message:'Login requis' });
        if (!email) return res.status(400).json({ success:false, message:'Email requis' });

        const code = Math.floor(100000 + Math.random() * 900000);

        try {
            let info = await transporter.sendMail({
                from: 'Mon Site 👤 <fttranscendence03@gmail.com>',
                to: email,
                subject: 'Code de vérification 2FA',
                text: `Bonjour ${login}, votre code de vérification est : ${code}`,
                html: `<b>Bonjour ${login},</b><br>Votre code de vérification est : <strong>${code}</strong>`
            });

            code_tmp_2fa.set(email, code);
            setTimeout(() => code_tmp_2fa.delete(email), 5 * 60 * 1000);

            res.json({ success: true, message: 'Code envoyé par Email', method: 'email' });

        } catch (err) {
            console.error('Erreur serveur :', err.message);
            res.status(500).json({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }
    });

    router.post('/verify', (req, res) => {
        const { login, email, code } = req.body;

        if (!login) return res.status(400).json({ success: false, message: 'Login requis' });
        if (!code) return res.status(400).json({ success: false, message: 'Code requis' });

        const userEmail = email || clients_email.get(login);

        if (!userEmail) return res.status(400).json({ success: false, message: 'Email requis' });

        const expectedCode = code_tmp_2fa.get(userEmail);

        if (!expectedCode) return res.status(404).json({ success: false, message: 'Aucun code de vérification ou secret actif trouvé pour cet utilisateur' });

        if (Number(code) === expectedCode) {
            code_tmp_2fa.delete(userEmail);

            const token = generateToken({ userLogin: login, method: 'email' });

            clients_method_2fa.set(login, 'email');
            clients_email.set(login, userEmail);

            return res.json({ success: true, message: 'Vérification réussie', token });
        }

        res.status(401).json({ success: false, message: 'Code de vérification invalide ou expiré' });
    });

  return router;
};
