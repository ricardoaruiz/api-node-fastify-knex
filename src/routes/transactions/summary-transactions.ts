/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'
import db from '../../db.js'
import { checkSessionIdExists } from '../../middleware/check-session-id-exists.js'

const ROUNDING_FACTOR = 100

export async function getTransactionsSummary(
	app: FastifyInstance,
	baseUrl: string
) {
	app.get(
		`${baseUrl}/summary`,
		{
			preHandler: [checkSessionIdExists],
		},
		async (request: FastifyRequest, reply: FastifyReply) => {
			const sessionId = request.sessionId

			// TODO extract to a repository
			const transactions = await db('transactions').select().where({
				session_id: sessionId,
			})

			// TODO extract to a service
			const summary = transactions.reduce(
				(acc, transaction) => {
					if (transaction.amount > 0) {
						acc.totalCredit +=
							Math.round(transaction.amount * ROUNDING_FACTOR) / ROUNDING_FACTOR
					}
					if (transaction.amount < 0) {
						acc.totalDebit +=
							Math.round(transaction.amount * ROUNDING_FACTOR) / ROUNDING_FACTOR
					}
					acc.total += transaction.amount
					acc.total = Math.round(acc.total * ROUNDING_FACTOR) / ROUNDING_FACTOR
					return acc
				},
				{ totalCredit: 0, totalDebit: 0, total: 0 }
			)

			return reply.status(StatusCodes.OK).send({
				data: {
					numberOfTransactions: transactions.length,
					summary,
				},
			})
		}
	)
}
