/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
/** biome-ignore-all lint/suspicious/noConsole: ignore here */
import type { FastifyInstance } from 'fastify'
import { getTables } from './get-tables.js'
import { listMigrations } from './list-migrations.js'

export const BASE_URL = '/database-check'

export async function databaseCheckRoutes(app: FastifyInstance) {
	app.addHook('preHandler', async (request, _reply) => {
		console.log('--- 🎲 DB CHECK HOOK ---')
		console.log('Esse hook roda antes de cada rota de database-check')
		console.log(`Rodando agora para rota : ${request.url}`)
		console.log('---------------------')
	})

	getTables(app, BASE_URL)
	listMigrations(app, BASE_URL)
}
