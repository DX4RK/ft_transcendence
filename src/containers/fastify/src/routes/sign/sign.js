const bcrypt = require('bcrypt');
const sendSMSCode = require('../../service/send/send_sms');
const sendEmailCode = require('../../service/send/send_email');

async function signRoutes(fastify, opts) {
	fastify.post('/in', async (request, reply) => {
		const { login, password } = request.body;

		reply.send({
			message: `login: ${login}, password: ${password}`,
			success: true,
		});
	});
};

module.exports = signRoutes;
