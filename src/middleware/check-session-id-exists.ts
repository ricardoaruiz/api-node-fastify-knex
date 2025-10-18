/** biome-ignore-all lint/suspicious/useAwait: no need */
import type { FastifyReply, FastifyRequest } from 'fastify'
import { StatusCodes } from 'http-status-codes'

export async function checkSessionIdExists(
	request: FastifyRequest,
	reply: FastifyReply
) {
	const sessionId = getSignedSessionIdFromRequest(request)

	if (!sessionId) {
		return reply.status(StatusCodes.FORBIDDEN).send({
			error: 'Unauthorized',
		})
	}

	request.sessionId = sessionId
}

export function getSignedSessionIdFromRequest(request: FastifyRequest) {
	return request.unsignCookie(request.cookies.sessionId ?? '').value ?? ''
}
