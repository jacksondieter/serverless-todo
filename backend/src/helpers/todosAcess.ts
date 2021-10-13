import * as AWS from 'aws-sdk'
// import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { TodoItem } from '../models/TodoItem'
import { TodoUpdate } from '../models/TodoUpdate';

// const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('TodosAccess')

// TODO: Implement the dataLayer logic
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
    return await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set name = :name, dueDate = :dueDate, done = :done',
        ExpressionAttributeValues: {
            ":name": todoUpdate.name,
            ":dueDate": todoUpdate.dueDate,
            ":done": todoUpdate.done
        }
    }).promise()
  }

  async deleteTodo(todoId: string, userId:string) {
      return await this.docClient.delete({
          TableName: this.todosTable,
          Key: {
            todoId,
            userId
          }
        }).promise()
  }  

  async updateAttachmentUrl(todoId: string, userId:string, url:string) {
    return await this.docClient.update({
        TableName: this.todosTable,
        Key: {
          todoId,
          userId
        },
        UpdateExpression: 'set attachmentUrl = :url',
        ExpressionAttributeValues: {
            ":url": url
        }
    }).promise()
  }
}
  
function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
    })
  }

  return new AWS.DynamoDB.DocumentClient()
}
