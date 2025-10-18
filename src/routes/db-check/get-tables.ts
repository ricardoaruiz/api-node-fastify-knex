/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db.js'

export async function getTables(app: FastifyInstance, baseUrl: string) {
	app.get(
		`${baseUrl}/tables`,
		async (_request: FastifyRequest, _reply: FastifyReply) => {
			const tables = await db('sqlite_schema').select('*')
			return JSON.stringify(tables)
		}
	)
}
