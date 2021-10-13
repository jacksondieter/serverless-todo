import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getTodosForUser as getTodosForUser } from '../../helpers/todos'
import { getUserId, Responses } from '../utils';
import {createLogger} from '../../utils/logger'
const logger = createLogger('getTodo')

// TODO: Get all TODO items for a current user - DONE

const getTodosHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Event: ${event}`)
    const userId = getUserId(event)
    const todos = await getTodosForUser(userId)
    if (!todos) {
      return Responses._404({ message: 'Failed to get todos' })
    }
    return Responses._200({ todos })
  }

export const handler = middy(getTodosHandler)
    .use(
      cors({
        credentials: true
      })
    )
