/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import z from 'zod'
import db from '../../db.js'
import { checkSessionIdExists } from '../../middleware/check-session-id-exists.js'

const GET_TRANSACTION_SCHEMA = z.object({
	id: z.uuid({ message: 'Invalid UUID format for ID' }),
})

type GetTransactionParams = z.infer<typeof GET_TRANSACTION_SCHEMA>

export async function getTransaction(app: FastifyInstance, baseUrl: string) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: 'GET',
		url: `${baseUrl}/:id`,
		schema: {
			params: GET_TRANSACTION_SCHEMA,
		},
		preHandler: [checkSessionIdExists],
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			const sessionId = request.sessionId
			const { id } = request.params as GetTransactionParams

			// TODO extract to a repository
			const transaction = await db('transactions')
				.where({ id, session_id: sessionId })
				.select()
				.first()

			if (!transaction) {
				return reply.status(StatusCodes.NOT_FOUND).send()
			}

			return reply.status(StatusCodes.OK).send({ data: transaction })
		},
	})
}
