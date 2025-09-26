const express = require('express');
const router = express.Router();

module.exports = ({ vonage, clients_phone, clients_method_2fa, code_tmp_2fa, generateToken }) => {
    router.post('/send', async (req, res) => {
    const { login, phone } = req.body;

    if (!login) return res.status(400).json({ success:false, message:'Login requis' });
    if (!phone) return res.status(400).json({ success:false, message:'Téléphone requis' });

    const code = Math.floor(100000 + Math.random() * 900000);

    try {
        const response = await vonage.sms.send({
        to: phone,
        from: '2FA-Test',
        text: `Bonjour ${login}, votre code de vérification est ${code}`
        });

        code_tmp_2fa.set(phone, code);
        setTimeout(() => code_tmp_2fa.delete(phone), 5 * 60 * 1000);

        res.json({ success: true, message: 'Code envoyé par SMS', method: 'sms' });

    } catch (err) {
        console.error('Erreur serveur :', err.message);
        res.status(500).json({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
    }
    });

    router.post('/verify', (req, res) => {
    const { login, phone, code } = req.body;

    if (!login) return res.status(400).json({ success: false, message: 'Login requis' });
    if (!code) return res.status(400).json({ success: false, message: 'Code requis' });

    const userPhone = phone || clients_phone.get(login);

    if (!userPhone) return res.status(400).json({ success: false, message: 'Numero requis' });

    const expectedCode = code_tmp_2fa.get(userPhone);

    if (!expectedCode) return res.status(404).json({ success: false, message: 'Aucun code de vérification ou secret actif trouvé pour cet utilisateur' });


    if (Number(code) === expectedCode) {
        code_tmp_2fa.delete(userPhone);

        const token = generateToken({ userLogin: login, method: 'sms' });
    
        clients_method_2fa.set(login, 'sms');
        clients_phone.set(login, userPhone);

        return res.json({ success: true, message: 'Vérification réussie', token });
    }
    res.status(401).json({ success: false, message: 'Code de vérification invalide ou expiré' });
    });

  return router;
};
