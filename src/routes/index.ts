import { databaseCheckRoutes } from './db-check/index.js'
import { healthRoutes } from './health/index.js'
import { transactionRoutes } from './transactions/index.js'

export const routes = [databaseCheckRoutes, healthRoutes, transactionRoutes]
