/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify'
import db from '../../db.js'

export async function listMigrations(app: FastifyInstance, baseUrl: string) {
	app.get(
		`${baseUrl}/migrations`,
		async (_request: FastifyRequest, _reply: FastifyReply) => {
			const migrations = await db('knex_migrations').select('*')
			return JSON.stringify(migrations)
		}
	)
}
