const sendSMSCode = require('../../service/send/send_sms');

async function smsRoutes(fastify, opts) {
    const { vonage, clients_phone, clients_method_2fa, code_tmp_2fa, generateToken } = opts;

    fastify.post('/send', async (request, reply) => {
        const { login, phone } = request.body;

        if (!login)
            return reply.code(400).send({ success:false, message:'Login requis' });
        if (!phone)
            return reply.code(400).send({ success:false, message:'Téléphone requis' });

        try {
            const response = await sendSMSCode(vonage, login, phone, code_tmp_2fa);
            fastify.log.info(response);
            return reply.send({ success: true, message: 'Code envoyé par SMS', method: 'sms' });
        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }
    });

    fastify.post('/verify', (request, reply) => {
        const { login, phone, code } = request.body;

        if (!login)
            return reply.code(400).send({ success: false, message: 'Login requis' });
        if (!code)
            return reply.code(400).send({ success: false, message: 'Code requis' });

        const userPhone = phone || clients_phone.get(login);

        if (!userPhone)
            return reply.code(400).send({ success: false, message: 'Numero requis' });

        const expectedCode = code_tmp_2fa.get(userPhone);

        if (!expectedCode)
            return reply.code(404).send({ success: false, message: 'Aucun code de vérification ou secret actif trouvé pour cet utilisateur' });

        if (Number(code) === Number(expectedCode)) {
            code_tmp_2fa.delete(userPhone);

            const token = generateToken({ userLogin: login, method: 'sms' });
        
            clients_method_2fa.set(login, 'sms');
            clients_phone.set(login, userPhone);

            return reply.send({ success: true, message: 'Vérification réussie', token });
        }
        return reply.code(401).send({ success: false, message: 'Code de vérification invalide ou expiré' });
    });
};

module.exports = smsRoutes;