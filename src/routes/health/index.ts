/** biome-ignore-all lint/suspicious/useAwait: removed unnecessary await */
import type { FastifyInstance } from 'fastify'
import { check } from './check.js'

const BASE_URL = '/health'

export async function healthRoutes(app: FastifyInstance) {
	check(app, BASE_URL)
}
