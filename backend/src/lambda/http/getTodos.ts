import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId, Responses } from '../utils';
import {createLogger} from '../../utils/logger'
const logger = createLogger('getTodo')

const getTodosHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Event: ${event}`)
    const userId = getUserId(event)
    const items = await getTodosForUser(userId)
    if (!items) {
      logger.info(`Event fail`)
      return Responses._404({ message: 'Failed to get todos' })
    }
    logger.info(`Event success`)
    return Responses._200({ items })
  }

export const handler = middy(getTodosHandler)
    .use(httpErrorHandler())
    .use(
      cors({
        credentials: true
      })
    )
