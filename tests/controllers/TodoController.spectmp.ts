import { ExportFormat } from '@/todo/enums/ExportFormat'
import { TodoPriority } from '@/todo/enums/TodoPriority'
import { TodoController } from '@/todo/controllers/TodoController'
import { TodoService } from '@/todo/services/TodoService'

interface DownloadResponse {
  setHeader(name: string, value: string): void
}

describe('TodoController', () => {
  let service: TodoService
  let controller: TodoController

  beforeEach(() => {
    service = new TodoService()
    controller = new TodoController(service)
  })

  it('delegates CRUD operations to the service', () => {
    expect(controller.list()).toHaveLength(3)
    expect(controller.findById(1).title).toBe('Conhecer a API')

    const created = controller.create({ title: 'Testar controller' })
    expect(controller.update(created.id, { completed: true }).completed).toBe(true)

    expect(controller.remove(created.id)).toBeUndefined()
    expect(() => controller.findById(created.id)).toThrow('não encontrada')
  })

  it('exports content as a downloadable file', () => {
    const setHeader = jest.fn()
    const response: DownloadResponse = { setHeader }

    const content = controller.export(ExportFormat.TXT, response)

    expect(content).toContain('Conhecer a API')
    expect(setHeader).toHaveBeenCalledWith('Content-Type', 'text/plain; charset=utf-8')
    expect(setHeader).toHaveBeenCalledWith('Content-Disposition', 'attachment; filename="todos.txt"')
  })

  it('builds a report and the workshop exports', () => {
    const report = controller.report(TodoPriority.HIGH)
    const setHeader = jest.fn()
    const response: DownloadResponse = { setHeader }

    expect(report.summary).toMatchObject({ completed: 1, highPriority: 1 })
    expect(report.lines).toHaveLength(1)
    expect(controller.exportReport(response)).toContain('Conhecer a API')
    expect(controller.diagnostics()).toMatchObject({ developerMode: true, todoCount: 3 })
  })
})
