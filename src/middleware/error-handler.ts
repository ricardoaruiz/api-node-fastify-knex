/** biome-ignore-all lint/suspicious/useAwait: not is necessary here */

import type { FastifyError, FastifyReply, FastifyRequest } from 'fastify'
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
} from 'fastify-type-provider-zod'
import { StatusCodes } from 'http-status-codes'

export async function errorHandler(
	err: FastifyError,
	_req: FastifyRequest,
	reply: FastifyReply
) {
	if (hasZodFastifySchemaValidationErrors(err)) {
		return reply.code(StatusCodes.BAD_REQUEST).send({
			error: 'Invalid validations',
			errors: groupErrorsByField(err.validation),
		})
	}

	if (isResponseSerializationError(err)) {
		return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
			error: 'Internal Server Error',
			message: "Response doesn't match the schema",
			details: {
				issues: err.cause.issues,
			},
		})
	}

	if (isResponseSerializationError(err)) {
		return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
			error: 'Internal Server Error',
		})
	}

	if (err.code === 'FST_ERR_CTP_INVALID_JSON_BODY') {
		return reply.code(StatusCodes.BAD_REQUEST).send({
			error: 'Bad Request',
			message: 'Invalid JSON body',
		})
	}

	return reply.code(StatusCodes.INTERNAL_SERVER_ERROR).send({
		error: 'Internal Server Error',
		message: `An unexpected error occurred - ${err.message}`,
	})
}

// biome-ignore lint/suspicious/noExplicitAny: review needed
function groupErrorsByField(errors: any[]) {
	return errors.reduce((acc, issue) => {
		const field = issue.instancePath.startsWith('/')
			? issue.instancePath.slice(1)
			: issue.instancePath
		const message = issue.message

		if (!acc[field]) {
			acc[field] = []
		}

		acc[field].push(message)
		return acc
	}, {})
}
