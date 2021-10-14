import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateTodo } from '../../helpers/todos'
import { UpdateTodoRequest } from '../../requests/UpdateTodoRequest'
import { getUserId, Responses } from '../utils'
import {createLogger} from '../../utils/logger'
const logger = createLogger('updateTodo')

const updateTodoHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Event: ${event}`)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const updatedTodo: UpdateTodoRequest = JSON.parse(event.body)
    const todo = await updateTodo(updatedTodo, todoId, userId)
    if (!todo) {
      logger.info(`Event fail`)
      return Responses._404({ message: 'Failed to update todo' })
    }
    logger.info(`Event success`)
    return Responses._200({ todo })
  }
export const handler = middy(updateTodoHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
