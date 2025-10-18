/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import db from '../../db.js'
import { checkSessionIdExists } from '../../middleware/check-session-id-exists.js'

export async function listTransactions(app: FastifyInstance, baseUrl: string) {
	app.get(
		baseUrl,
		{
			preHandler: [checkSessionIdExists],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const sessionId = request.sessionId

			// TODO extract to a repository
			const transactions = await db('transactions').select().where({
				session_id: sessionId,
			})

			return reply.status(StatusCodes.OK).send({
				data: transactions,
			})
		}
	)
}
