import { TodoAccess } from './todosAcess'
import { AttachmentUtils } from './attachmentUtils';
import { TodoItem } from '../models/TodoItem'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'
// import * as createError from 'http-errors'
// import { TodoUpdate } from '../models/TodoUpdate'

// TODO: Implement businessLogic
const todoAccess =  new TodoAccess()
const attachment =  new AttachmentUtils()
const logger = createLogger('todoLogic')
export async function getTodosForUser(userId): Promise<TodoItem[]> {
    logger.info(`get Todos For User`)
    return await todoAccess.getTodosForUser(userId)
  }

  async function getTodo(todoId: string, userId: string) {
    const todo = await todoAccess.getTodoItem(todoId, userId)
    if (!todo) {
      throw new Error("Access denied")
    }
    return todo
  }
  
export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {

  const todoId = uuid.v4()

  return await todoAccess.createTodo({
    todoId,
    userId,
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    createdAt: new Date().toISOString(),
    done:false
  })
}

export async function updateTodo(
  updateTodoRequest: UpdateTodoRequest,
  todoUpdateId:string,
  userId: string
){
  await getTodo(todoUpdateId,userId)

  return await todoAccess.updateTodo(todoUpdateId,userId,updateTodoRequest)
}

export async function deleteTodo(
  todoDeleteId:string,
  userId: string
){
  await getTodo(todoDeleteId,userId)

  return await todoAccess.deleteTodo(todoDeleteId, userId)
}

export async function createAttachmentPresignedUrl(
  todoId:string,
  userId: string
){
  const imageId = uuid.v4()
  const uploadUrl = attachment.getPutSignedUrl(imageId)
  const imageUrl = attachment.getGetUrl(imageId)
  await todoAccess.updateAttachmentUrl(todoId, userId,imageUrl)
  return uploadUrl
}