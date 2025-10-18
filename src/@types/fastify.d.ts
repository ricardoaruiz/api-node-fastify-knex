/** biome-ignore-all lint/nursery/useConsistentTypeDefinitions: ignored */
import 'fastify'

declare module 'fastify' {
	interface FastifyRequest {
		sessionId?: string | undefined
	}
}
