module.exports = async function (fastify, opts) {
	const testList = []

	fastify.route({
		url: '/test',
		method: 'GET',
		handler: function myHandler(request, reply) {
			reply.send({
				message: 'Test listed successfuully',
				success: true,
				data: testList,
			});
		},
	});
};
