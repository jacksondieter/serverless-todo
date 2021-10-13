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
    // TODO: Remove a TODO item by id - DONE
    const todo = await deleteTodo(todoId, userId)
    if (!todo) {
      return Responses._404({ message: 'Failed to delete todo' })
    }
    return Responses._200({ todo })
  }
export const handler = middy(deleteTodoHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
