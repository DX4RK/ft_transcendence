const express = require('express');
const qrcode = require('qrcode');
const speakeasy = require('speakeasy');
const router = express.Router();

module.exports = ({ clients_method_2fa, code_totp_2fa, generateToken }) => {
    router.post('/send', async (req, res) => {
        const { login } = req.body;

        if (!login) return res.status(400).json({ success: false, message: 'Login requis' });

        try {
            let userSecret = code_totp_2fa.get(login);

            if (!userSecret) {
                const secret = speakeasy.generateSecret({ length: 20, name: login, issuer: '2FA-Test' });
                userSecret = secret.base32;
                code_totp_2fa.set(login, userSecret);

                qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
                    if (err) return res.json({ success: false, message: 'Erreur QR Code' });

                    res.json({ success: true, qrCode: data_url, secret: secret.base32 });

                });
            } else {
            res.status(409).json({ success: false, message: '2FA déjà configuré pour cet utilisateur' });
            }
        } catch (err) {
            console.error('Erreur serveur :', err.message);
            res.status(500).json({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }
    });

    router.post('/verify', (req, res) => {
        const { login, code } = req.body;

        if (!login) return res.status(400).json({ success: false, message: 'Login requis' });
        if (!code) return res.status(400).json({ success: false, message: 'Code requis' });

        const expectedCode = code_totp_2fa.get(login);

        if (!expectedCode) return res.status(404).json({ success: false, message: 'Aucun code de vérification ou secret actif trouvé pour cet utilisateur' });

        const verified = speakeasy.totp.verify({
            secret: expectedCode,
            encoding: 'base32',
            token: code,
            window: 1
        });

        if (verified) {
            const token = generateToken({ userLogin: login, method: 'totp' });
            
            clients_method_2fa.set(login, 'totp');

            return res.json({ success: true, message: 'Vérification réussie', token });
        }
        res.status(401).json({ success: false, message: 'Code de vérification invalide ou expiré' });
    });

  return router;
};
