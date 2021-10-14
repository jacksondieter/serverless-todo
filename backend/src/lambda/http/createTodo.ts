import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { CreateTodoRequest } from '../../requests/CreateTodoRequest'
import { getUserId, Responses } from '../utils';
import { createTodo } from '../../helpers/todos'
import {createLogger} from '../../utils/logger'
const logger = createLogger('createTodo')

const createTodoHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Event: ${event}`)
    const userId = getUserId(event)
    const newTodo: CreateTodoRequest = JSON.parse(event.body)
    const item = await createTodo(newTodo,userId)
    if (!item) {
      logger.info(`Event fail`)
      return Responses._404({ message: 'Failed to create todo' })
    }
    logger.info(`Event success`)
    return Responses._201({item})
  }
export const handler = middy(createTodoHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
