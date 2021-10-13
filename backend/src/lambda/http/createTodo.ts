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
    // TODO: Implement creating a new TODO item
    const todo = await createTodo(newTodo,userId)
    if (!todo) {
      return Responses._404({ message: 'Failed to create todo' })
    }
    return Responses._201({todo})
  }
export const handler = middy(createTodoHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
