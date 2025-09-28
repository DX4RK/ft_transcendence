const bcrypt = require('bcrypt');
const sendSMSCode = require('../../service/send/send_sms');
const sendEmailCode = require('../../service/send/send_email');

async function signRoutes(fastify, opts) {
    const { vonage, transporter, clients_password, clients_phone, clients_email, clients_method_2fa, code_tmp_2fa } = opts;
   
    fastify.post('/up', async (request, reply) => {
        const { login, password } = request.body;

        if (clients_password.has(login)) 
            return reply.code(400).send({ success: false, message: 'Utilisateur déjà inscrit' });

        const hashedPassword = await bcrypt.hash(password, 10);
        clients_password.set(login, hashedPassword);

        return reply.code(201).send({ success: true, message: 'Inscription réussie' });
    });

    fastify.post('/in', async (request, reply) => {
        const { login, password } = request.body;
        const expected_password = clients_password.get(login);
        const method = clients_method_2fa.get(login);

        if (!clients_password.has(login))
            return reply.code(404).send({ success: false, message: 'Utilisateur inconnu' });

        const match = await bcrypt.compare(password, expected_password);
        if (!match)
            return reply.code(401).send({ success: false, message: 'Mot de passe incorrect' });
        
        try {
            if (method === 'sms') { // sms
                const phone = clients_phone.get(login);
                const response = await sendSMSCode(vonage, login, phone, code_tmp_2fa);
                fastify.log.info(response);
            } else if (method === 'email') { // email
                const email = clients_email.get(login);
                const info = await sendEmailCode(transporter, login, email, code_tmp_2fa);
                fastify.log.info(info);
            } else if (method !== 'totp')
                return reply.code(400).send({ success: false, message: 'Méthode 2FA non configurée pour cet utilisateur' });

            return reply.send({ success: true, method, message: `Code de vérification envoyé par ${method}` }); 

        } catch (err) {
            fastify.log.error(err);
            return reply.code(500).send({ success: false, message: 'Erreur interne : impossible d’envoyer le code de vérification' });
        }
    });
};

module.exports = signRoutes;