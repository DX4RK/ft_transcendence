const qrcode = require('qrcode');
const speakeasy = require('speakeasy');

async function totpRoutes(fastify, opts) {
    const { clients_method_2fa, code_totp_2fa, generateToken } = opts;

    fastify.post('/send', async (request, reply) => {
        const { login } = request.body;

        if (!login)
            return reply.code(400).send({ success: false, message: 'Login requis' });

        try {
            let userSecret = code_totp_2fa.get(login);

            if (!userSecret) {
                const secret = speakeasy.generateSecret({ length: 20, name: login, issuer: '2FA-Test' });
                userSecret = secret.base32;
                code_totp_2fa.set(login, userSecret);

                const data_url = await qrcode.toDataURL(secret.otpauth_url);
                return reply.send({ success: true, qrCode: data_url, secret: secret.base32 });
            } else
                return reply.code(409).send({ success: false, message: '2FA déjà configuré pour cet utilisateur' });

        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }
    });

    fastify.post('/verify', (request, reply) => {
        const { login, code } = request.body;

        if (!login)
            return reply.code(400).send({ success: false, message: 'Login requis' });
        if (!code)
            return reply.code(400).send({ success: false, message: 'Code requis' });

        const expectedCode = code_totp_2fa.get(login);

        if (!expectedCode)
            return reply.code(404).send({ success: false, message: 'Aucun code de vérification ou secret actif trouvé pour cet utilisateur' });

        const verified = speakeasy.totp.verify({
            secret: expectedCode,
            encoding: 'base32',
            token: code,
            window: 1
        });

        if (verified) {
            const token = generateToken({ userLogin: login, method: 'totp' });
            
            clients_method_2fa.set(login, 'totp');

            return reply.send({ success: true, message: 'Vérification réussie', token });
        }
        return reply.code(401).send({ success: false, message: 'Code de vérification invalide ou expiré' });
    });
};

module.exports = totpRoutes;