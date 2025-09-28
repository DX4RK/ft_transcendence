const sendEmailCode = require('../../service/send/send_email');

async function emailRoutes(fastify, opts) {
    const { transporter, clients_email, clients_method_2fa, code_tmp_2fa, generateToken } = opts;

    fastify.post('/send', async (request, reply) => {
        const { login, email } = request.body;

        if (!login)
            return reply.code(400).send({ success:false, message:'Login requis' });
        if (!email)
            return reply.code(400).send({ success:false, message:'Email requis' });

        try {
            const info = await sendEmailCode(transporter, login, email, code_tmp_2fa);
            fastify.log.info(info);
            return reply.send({ success: true, message: 'Code envoyé par Email', method: 'email' });
        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }
    });

    fastify.post('/verify', (req, reply) => {
        const { login, email, code } = req.body;

        if (!login)
            return reply.code(400).send({ success: false, message: 'Login requis' });
        if (!code)
            return reply.code(400).send({ success: false, message: 'Code requis' });

        const userEmail = email || clients_email.get(login);

        if (!userEmail)
            return reply.code(400).send({ success: false, message: 'Email requis' });

        const expectedCode = code_tmp_2fa.get(userEmail);

        if (!expectedCode)
            return reply.code(404).send({ success: false, message: 'Aucun code de vérification ou secret actif trouvé pour cet utilisateur' });

        if (Number(code) === Number(expectedCode)) {
            code_tmp_2fa.delete(userEmail);

            const token = generateToken({ userLogin: login, method: 'email' });

            clients_method_2fa.set(login, 'email');
            clients_email.set(login, userEmail);

            return reply.send({ success: true, message: 'Vérification réussie', token });
        }
        return reply.code(401).send({ success: false, message: 'Code de vérification invalide ou expiré' });
    });
};

module.exports = emailRoutes;