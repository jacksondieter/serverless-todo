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
const convertWithUrl = (item: TodoItem)=>{
  if (item.attachmentUrl) {
    const attachmentUrl = attachment.getGetUrl(item.attachmentUrl)
    return {...item,attachmentUrl}
  }
  return item
}
export async function getTodosForUser(userId): Promise<TodoItem[]> {
    logger.info(`get Todos For User`)
    const items =  await (await todoAccess.getTodosForUser(userId)).map(convertWithUrl)
    return items
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
  logger.info(`create Todos`)
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
  logger.info(`update Todos`)
  await getTodo(todoUpdateId,userId)

  return await todoAccess.updateTodo(todoUpdateId,userId,updateTodoRequest)
}

export async function deleteTodo(
  todoDeleteId:string,
  userId: string
){
  logger.info(`delete Todos`)
  try {
    const todo = await getTodo(todoDeleteId,userId)  
    await todoAccess.deleteTodo(todoDeleteId, userId)
    await attachment.deleteImg(todo.attachmentUrl)
  return todo
  } catch (error) {
    
  }
  
}

export async function createAttachmentPresignedUrl(
  todoId:string,
  userId: string
){
  logger.info(`create Url`)
  const todo = await getTodo(todoId,userId)
  const imageId = todo.attachmentUrl || uuid.v4()
  const uploadUrl = attachment.getPutSignedUrl(imageId)
  await todoAccess.updateAttachmentUrl(todoId, userId, imageId)
  return uploadUrl
}