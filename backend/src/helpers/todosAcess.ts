// import * as AWS from 'aws-sdk'
import {XAWS as AWS}from './AWS'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

const logger = createLogger('TodosAccess')

export class TodoAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly todosIndexTable = process.env.TODOS_CREATED_AT_INDEX
    ) {
  }

  async getTodosForUser(userId): Promise<TodoItem[]> {
    logger.info(`Getting all todos for user:${userId}`)

    const result = await this.docClient.query({
      TableName: this.todosTable,
      IndexName: this.todosIndexTable,
      ExpressionAttributeValues: {':uid': userId},
      KeyConditionExpression: 'userId = :uid',        
    }).promise()

    return result.Items as TodoItem[]
  }

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    logger.info(`Create todos`)
    await this.docClient.put({
      TableName: this.todosTable,
      Item: todo
    }).promise()

    return todo
  }

  async getTodoItem(todoId: string, userId: string): Promise<TodoItem> {
    logger.info(`Getting todo ${todoId} from ${this.todosTable}`)

    const result = await this.docClient.get({
      TableName: this.todosTable,
      Key: {
        todoId,
        userId
      }
    }).promise()

    return result.Item as TodoItem

  }
  async updateTodo(todoId: string, userId:string, todoUpdate:TodoUpdate) {
    logger.info(`Update todos for todo:${todoId}`)
    return await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set done = :done',
        ExpressionAttributeValues: {
            ":done": todoUpdate.done
        }
    }).promise()
  }

  async deleteTodo(todoId: string, userId:string) {
    logger.info(`Delete todos for todo:${todoId}`)
      return await this.docClient.delete({
          TableName: this.todosTable,
          Key: {
            todoId,
            userId
          }
        }).promise()
  }  

  async updateAttachmentUrl(todoId: string, userId:string, imageId:string) {
    logger.info(`Update url for todo:${todoId}`)
    return await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: {
            ":url": imageId
        }
    }).promise()
  }
}
  
function createDynamoDBClient() {
  // @ts-ignore: Unreachable code error
  return new AWS.DynamoDB.DocumentClient()
}
