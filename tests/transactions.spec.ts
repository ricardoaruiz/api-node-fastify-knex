/** biome-ignore-all lint/style/noMagicNumbers: ignored */

import { StatusCodes } from 'http-status-codes'
import request from 'supertest'
import { beforeEach, describe, expect, it } from 'vitest'
import app from '../src/app.js'
import db from '../src/db.js'

describe('Transactions routes', () => {
	// Clear the tables before each test instead of running migrations
	beforeEach(async () => {
		await db('transactions').del()
	})

	describe('Create Transaction', () => {
		it('should return 400 when title is empty', async () => {
			await request(app.server)
				.post('/transactions')
				.send({
					title: '',
					amount: 1000,
					type: 'credit',
				})
				.expect(StatusCodes.BAD_REQUEST)
				.expect((response) => {
					expect(response.body.error).toEqual('Invalid validations')
					expect(response.body.errors.title).toContain('Title is required')
				})
		})

		it('should return 400 when amount is zero', async () => {
			await request(app.server)
				.post('/transactions')
				.send({
					title: 'Transação de teste',
					amount: 0,
					type: 'credit',
				})
				.expect(StatusCodes.BAD_REQUEST)
				.expect((response) => {
					expect(response.body.error).toEqual('Invalid validations')
					expect(response.body.errors.amount).toContain(
						'Amount must be greater than 0'
					)
				})
		})

		it('should return 400 when type is invalid', async () => {
			await request(app.server)
				.post('/transactions')
				.send({
					title: 'Transação de teste',
					amount: 1000,
					type: 'invalid-type',
				})
				.expect(StatusCodes.BAD_REQUEST)
				.expect((response) => {
					expect(response.body.error).toEqual('Invalid validations')
					expect(response.body.errors.type).toContain(
						'Type must be credit or debit'
					)
				})
		})

		it('should user can create a new transaction', async () => {
			await request(app.server)
				.post('/transactions')
				.send({
					title: 'Transação de teste',
					amount: 1000,
					type: 'credit',
				})
				.expect(StatusCodes.CREATED)
		})
	})

	describe('Get All Transactions', () => {
		it('should user can get all transactions', async () => {
			const createdTransactionResponse = await request(app.server)
				.post('/transactions')
				.send({
					title: 'Transação de teste',
					amount: 1000,
					type: 'credit',
				})
				.expect(StatusCodes.CREATED)

			const cookies = createdTransactionResponse.get('Set-Cookie')

			if (!cookies) {
				throw new Error('No cookies set in the response')
			}

			const listTransactionResponse = await request(app.server)
				.get('/transactions')
				.set('Cookie', cookies)
				.expect(StatusCodes.OK)

			expect(listTransactionResponse.body.data).toHaveLength(1)
			expect(listTransactionResponse.body.data).toEqual([
				expect.objectContaining({
					title: 'Transação de teste',
					amount: 1000,
				}),
			])
		})
	})

	describe('Get Specific Transactions', () => {
		it('should user can get a specific transactions', async () => {
			const req = request(app.server)

			// Create a new transaction
			const createdTransactionResponse = await req
				.post('/transactions')
				.send({
					title: 'Transação de teste específica',
					amount: 1000,
					type: 'credit',
				})
				.expect(StatusCodes.CREATED)

			const cookies = createdTransactionResponse.get('Set-Cookie')

			if (!cookies) {
				throw new Error('No cookies set in the response')
			}

			// List all transactions to get the ID of the created transaction
			const listTransactionResponse = await req
				.get('/transactions')
				.set('Cookie', cookies)
				.expect(StatusCodes.OK)

			expect(listTransactionResponse.body.data).toHaveLength(1)
			expect(listTransactionResponse.body.data).toEqual([
				expect.objectContaining({
					title: 'Transação de teste específica',
					amount: 1000,
				}),
			])

			// Extract the transaction ID
			const transactionId = listTransactionResponse.body.data[0].id

			// Get the specific transaction by ID
			await req
				.get(`/transactions/${transactionId}`)
				.set('Cookie', cookies)
				.expect(StatusCodes.OK)
				.expect((response) => {
					expect(response.body.data).toEqual(
						expect.objectContaining({
							title: 'Transação de teste específica',
							amount: 1000,
						})
					)
				})
		})
	})

	describe('Get Summary Transactions', () => {
		it('should user can get all summary transactions', async () => {
			const req = request(app.server)

			const createdCreditTransaction = await req
				.post('/transactions')
				.send({
					title: 'Transação de crédito',
					amount: 5000,
					type: 'credit',
				})
				.expect(StatusCodes.CREATED)

			const cookies = createdCreditTransaction.get('Set-Cookie')

			if (!cookies) {
				throw new Error('No cookies set in the response')
			}

			await req
				.post('/transactions')
				.set('Cookie', cookies)
				.send({
					title: 'Transação de débito',
					amount: 2000,
					type: 'debit',
				})
				.expect(StatusCodes.CREATED)

			const summaryTransactions = await req
				.get('/transactions/summary')
				.set('Cookie', cookies)
				.expect(StatusCodes.OK)

			expect(summaryTransactions.body.data.numberOfTransactions).toBe(2)
			expect(summaryTransactions.body.data.summary.total).toBe(3000)
			expect(summaryTransactions.body.data.summary.totalCredit).toBe(5000)
			expect(summaryTransactions.body.data.summary.totalDebit).toBe(-2000)
		})
	})
})
