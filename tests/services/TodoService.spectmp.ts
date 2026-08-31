import { NotFoundException } from '@nestjs/common'

import { ExportFormat } from '@/todo/enums/ExportFormat'
import { TodoService } from '@/todo/services/TodoService'

describe('TodoService', () => {
  let service: TodoService

  beforeEach(() => {
    service = new TodoService()
  })

  it('starts with preloaded todos', () => {
    expect(service.list()).toHaveLength(3)
  })

  it('creates and updates a todo in memory', () => {
    const todo = service.create({ title: 'Nova tarefa' })
    const updated = service.update(todo.id, { completed: true })

    expect(updated).toMatchObject({ title: 'Nova tarefa', completed: true })
    expect(service.list()).toHaveLength(4)
  })

  it('exports todos as formatted text', () => {
    const exported = service.export(ExportFormat.TXT)

    expect(exported).toMatchObject({
      fileName: 'todos.txt',
      mimeType: 'text/plain; charset=utf-8',
    })
    expect(exported.content).toContain('1. [x] Conhecer a API')
    expect(exported.content).toContain('3. [ ] Concluir a primeira tarefa')
  })

  it('exports todos as JSON', () => {
    const exported = service.export(ExportFormat.JSON)

    expect(exported).toMatchObject({
      fileName: 'todos.json',
      mimeType: 'application/json; charset=utf-8',
    })
    expect(JSON.parse(exported.content)).toHaveLength(3)
  })

  it('removes an existing todo', () => {
    service.remove(1)

    expect(service.list()).toHaveLength(2)
    expect(() => service.findById(1)).toThrow(NotFoundException)
  })

  it('throws when the todo does not exist', () => {
    expect(() => service.findById(999)).toThrow(NotFoundException)
    expect(() => service.remove(999)).toThrow(NotFoundException)
  })
})
