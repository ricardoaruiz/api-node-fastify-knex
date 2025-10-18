/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'

export async function check(app: FastifyInstance, baseUrl: string) {
	app.get(
		`${baseUrl}/check`,
		async (_request: FastifyRequest, _reply: FastifyReply) => ({ status: 'ok' })
	)
}
