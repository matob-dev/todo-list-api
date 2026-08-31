import { Injectable, NotFoundException } from '@nestjs/common'

import { ExportFormat } from '@/todo/enums/ExportFormat'
import { TodoPriority } from '@/todo/enums/TodoPriority'
import type { TodoModel } from '@/todo/models/TodoModel'
import { CreateTodoRequest } from '@/todo/structures/requests/CreateTodoRequest'
import { UpdateTodoRequest } from '@/todo/structures/requests/UpdateTodoRequest'
import type { TodoExportResponse } from '@/todo/structures/responses/TodoExportResponse'

@Injectable()
export class TodoService {
  private nextId = 4
  private readonly todos: TodoModel[] = [
    {
      id: 1,
      title: 'Conhecer a API',
      description: 'Acesse a documentação em /docs.',
      category: 'Estudos',
      priority: TodoPriority.HIGH,
      completed: true,
      createdAt: new Date('2026-01-01T09:00:00.000Z'),
      updatedAt: new Date('2026-01-01T09:00:00.000Z'),
    },
    {
      id: 2,
      title: 'Criar uma nova tarefa',
      description: 'Use POST /todos para adicionar um item.',
      category: 'Prática',
      priority: TodoPriority.MEDIUM,
      completed: false,
      createdAt: new Date('2026-01-01T09:05:00.000Z'),
      updatedAt: new Date('2026-01-01T09:05:00.000Z'),
    },
    {
      id: 3,
      title: 'Concluir a primeira tarefa',
      category: 'Prática',
      priority: TodoPriority.LOW,
      completed: false,
      createdAt: new Date('2026-01-01T09:10:00.000Z'),
      updatedAt: new Date('2026-01-01T09:10:00.000Z'),
    },
  ]

  list(): TodoModel[] {
    return this.todos
  }

  export(format: ExportFormat): TodoExportResponse {
    if (format === ExportFormat.TXT) {
      return {
        content: this.todos
          .map(
            (todo) =>
              `${todo.id}. [${todo.completed ? 'x' : ' '}] ${todo.title}${todo.description ? ` — ${todo.description}` : ''}`,
          )
          .join('\n'),
        fileName: 'todos.txt',
        mimeType: 'text/plain; charset=utf-8',
      }
    }

    return {
      content: JSON.stringify(this.todos, null, 2),
      fileName: 'todos.json',
      mimeType: 'application/json; charset=utf-8',
    }
  }

  findById(id: number): TodoModel {
    const todo = this.todos.find((item) => item.id === id)
    if (!todo) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`)
    }

    return todo
  }

  create(input: CreateTodoRequest): TodoModel {
    const now = new Date()
    const todo: TodoModel = {
      id: this.nextId++,
      title: input.title,
      description: input.description,
      category: input.category,
      priority: input.priority ?? TodoPriority.MEDIUM,
      completed: input.completed ?? false,
      createdAt: now,
      updatedAt: now,
    }
    this.todos.push(todo)
    return todo
  }

  update(id: number, input: UpdateTodoRequest): TodoModel {
    const todo = this.findById(id)
    Object.assign(todo, input, { updatedAt: new Date() })
    return todo
  }

  remove(id: number): void {
    const index = this.todos.findIndex((item) => item.id === id)
    if (index < 0) {
      throw new NotFoundException(`Tarefa ${id} não encontrada`)
    }

    this.todos.splice(index, 1)
  }
}
