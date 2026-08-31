
import { TodoService } from '@/todo/services/TodoService'

describe('TodoService', () => {
  let service: TodoService

  beforeEach(() => {
    service = new TodoService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
