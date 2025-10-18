/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance } from 'fastify'
import { createTransaction } from './create-transaction.js'
import { getTransaction } from './get-transaction.js'
import { listTransactions } from './list-transactions.js'
import { getTransactionsSummary } from './summary-transactions.js'

export const BASE_URL = '/transactions'

export async function transactionRoutes(app: FastifyInstance) {
	listTransactions(app, BASE_URL)
	getTransaction(app, BASE_URL)
	getTransactionsSummary(app, BASE_URL)
	createTransaction(app, BASE_URL)
}
