import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { createAttachmentPresignedUrl } from '../../helpers/todos'
import { getUserId, Responses } from '../utils'
import {createLogger} from '../../utils/logger'
const logger = createLogger('updateTodo')

const uploadUrlHandler =
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info(`Event: ${event}`)
    const userId = getUserId(event)
    const todoId = event.pathParameters.todoId
    const uploadUrl = await createAttachmentPresignedUrl(todoId, userId) 
    if (!uploadUrl) {
      logger.info(`Event fail`)
      return Responses._404({ message: 'Failed to delete todo' })
    }
    logger.info(`Event success`)
    return Responses._200( {uploadUrl} )
  }
export const handler = middy(uploadUrlHandler)
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
