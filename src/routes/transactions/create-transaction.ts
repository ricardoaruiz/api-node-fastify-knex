/** biome-ignore-all lint/style/noMagicNumbers: removed intentional magic numbers */
/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import type { ZodTypeProvider } from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'
import z from 'zod/v4'
import db from '../../db.js'
import { getSignedSessionIdFromRequest } from '../../middleware/check-session-id-exists.js'

const TransactionType = {
	CREDIT: 'credit',
	DEBIT: 'debit',
}

const CREATE_TRANSACTION_SCHEMA = z.object({
	title: z.string().trim().min(1, { message: 'Title is required' }),
	amount: z.number().min(1, { message: 'Amount must be greater than 0' }),
	type: z.enum(Object.values(TransactionType), {
		message: 'Type must be credit or debit',
	}),
})
type CreateTransactionInput = z.infer<typeof CREATE_TRANSACTION_SCHEMA>

export async function createTransaction(app: FastifyInstance, baseUrl: string) {
	app.withTypeProvider<ZodTypeProvider>().route({
		method: 'POST',
		url: baseUrl,
		schema: { body: CREATE_TRANSACTION_SCHEMA },
		handler: async (request: FastifyRequest, reply: FastifyReply) => {
			let sessionId = getSignedSessionIdFromRequest(request)

			if (!sessionId) {
				sessionId = crypto.randomUUID()
				reply.cookie('sessionId', sessionId, {
					path: '/',
					signed: true,
					secure: true,
					httpOnly: true,
					maxAge: 60 * 60 * 24 * 7, // 7 days
				})
			}

			const body = request.body as CreateTransactionInput
			try {
				const { title, amount, type } = body
				const id = crypto.randomUUID()
				const isCredit = type === TransactionType.CREDIT

				// Extract to a repository
				await db('transactions').insert({
					id,
					title,
					amount: isCredit ? amount : -amount,
					session_id: sessionId,
				})

				return reply.status(StatusCodes.CREATED).send()
			} catch (error) {
				throw new Error(
					`Failed to create transaction - ${(error as Error).message}`
				)
			}
		},
	})
}
