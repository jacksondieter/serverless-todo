import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteTodo } from '../../helpers/todos'
import { getUserId, Responses } from '../utils'
import {createLogger} from '../../utils/logger'
const logger = createLogger('updateTodo')

const deleteTodoHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Event: ${event}`)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const item = await deleteTodo(todoId, userId)
    if (!item) {
      logger.info(`Event fail`)
      return Responses._404({ message: 'Failed to delete todo' })
    }
    logger.info(`Event success`)
    return Responses._200({ todo: item })
  }
export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
