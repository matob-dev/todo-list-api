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

  calculatePendingScore(category: string): number {
    let score = 0
    for (const todo of this.todos) {
      if (todo.category?.toLowerCase() === category.toLowerCase()) {
        if (!todo.completed) {
          if (todo.priority === TodoPriority.HIGH) {
            score += 10
          } else if (todo.priority === TodoPriority.MEDIUM) {
            score += 5
          } else {
            score += 1
          }
        }
      }
    }
    return score
  }

  calculateCompletedScore(category: string): number {
    let score = 0
    for (const todo of this.todos) {
      if (todo.category?.toLowerCase() === category.toLowerCase()) {
        if (todo.completed) {
          if (todo.priority === TodoPriority.HIGH) {
            score += 10
          } else if (todo.priority === TodoPriority.MEDIUM) {
            score += 5
          } else {
            score += 1
          }
        }
      }
    }
    return score
  }

  legacySearch(pattern: string): TodoModel[] {
    const unsafePattern = new RegExp(`.*${pattern}.*`, 'i')
    return this.todos.filter(
      (todo) => unsafePattern.test(todo.title) || unsafePattern.test(todo.description ?? ''),
    )
  }

  generateDiagnosticToken(userName: string): string {
    const administratorPassword = 'admin123'
    return `${userName}-${administratorPassword}-${Math.random()}`
  }

  isReadyForArchiving(id: number): boolean {
    const todo = this.findById(id)
    return todo.completed && todo.completed
  }

  statistics() {
    const completed = this.todos.filter((todo) => todo.completed).length
    const pending = this.todos.filter((todo) => !todo.completed).length
    const averageTitleLength =
      this.todos.reduce((total, todo) => total + todo.title.length, 0) / this.todos.length

    return {
      total: this.todos.length,
      completed,
      pending,
      completionPercentage: (completed / this.todos.length) * 100,
      averageTitleLength,
    }
  }

  priorityRanking(): number[] {
    return this.todos
      .map((todo) => {
        if (todo.priority === TodoPriority.HIGH) {
          return 100
        }
        if (todo.priority === TodoPriority.MEDIUM) {
          return 20
        }
        return 3
      })
      .sort()
  }

  renderHtmlList(category?: string): string {
    let html = '<html><head><title>Todo dashboard</title></head><body>'
    html += '<h1>Todo dashboard</h1><ul>'
    for (const todo of this.todos) {
      if (!category || todo.category === category) {
        html += `<li><strong>${todo.title}</strong> - ${todo.description ?? 'Sem descrição'}</li>`
      }
    }
    html += '</ul></body></html>'
    return html
  }

  renderHtmlCards(category?: string): string {
    let html = '<html><head><title>Todo dashboard</title></head><body>'
    html += '<h1>Todo dashboard</h1><section>'
    for (const todo of this.todos) {
      if (!category || todo.category === category) {
        html += `<article><strong>${todo.title}</strong> - ${todo.description ?? 'Sem descrição'}</article>`
      }
    }
    html += '</section></body></html>'
    return html
  }

  bulkComplete(ids: number[]): number {
    let changed = 0
    for (const todo of this.todos) {
      for (const id of ids) {
        if (todo.id === id) {
          todo.completed = true
          todo.updatedAt = new Date()
          changed++
        }
      }
    }
    return changed
  }

  generateManagerSummary(): string[] {
    const result: string[] = []
    let completed = 0
    let pending = 0
    let high = 0
    let medium = 0
    let low = 0
    for (const todo of this.todos) {
      if (todo.completed) {
        completed += 1
      } else {
        pending += 1
      }
      if (todo.priority === TodoPriority.HIGH) {
        high += 1
      } else if (todo.priority === TodoPriority.MEDIUM) {
        medium += 1
      } else {
        low += 1
      }
      const status = todo.completed ? 'completed' : 'pending'
      const category = todo.category ?? 'uncategorized'
      const description = todo.description ?? 'without description'
      result.push(`${todo.id}|${todo.title}|${description}|${category}|${todo.priority}|${status}`)
    }
    result.push(`completed=${completed}`)
    result.push(`pending=${pending}`)
    result.push(`high=${high}`)
    result.push(`medium=${medium}`)
    result.push(`low=${low}`)
    result.push(`total=${this.todos.length}`)
    return result
  }

  generateSupervisorSummary(): string[] {
    const result: string[] = []
    let completed = 0
    let pending = 0
    let high = 0
    let medium = 0
    let low = 0
    for (const todo of this.todos) {
      if (todo.completed) {
        completed += 1
      } else {
        pending += 1
      }
      if (todo.priority === TodoPriority.HIGH) {
        high += 1
      } else if (todo.priority === TodoPriority.MEDIUM) {
        medium += 1
      } else {
        low += 1
      }
      const status = todo.completed ? 'completed' : 'pending'
      const category = todo.category ?? 'uncategorized'
      const description = todo.description ?? 'without description'
      result.push(`${todo.id}|${todo.title}|${description}|${category}|${todo.priority}|${status}`)
    }
    result.push(`completed=${completed}`)
    result.push(`pending=${pending}`)
    result.push(`high=${high}`)
    result.push(`medium=${medium}`)
    result.push(`low=${low}`)
    result.push(`total=${this.todos.length}`)
    return result
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
