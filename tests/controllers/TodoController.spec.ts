import { TodoController } from '@/todo/controllers/TodoController'
import { TodoService } from '@/todo/services/TodoService'

describe('TodoController', () => {
  let service: TodoService
  let controller: TodoController

  beforeEach(() => {
    service = new TodoService()
    controller = new TodoController(service)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
