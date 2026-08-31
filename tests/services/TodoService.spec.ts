
import { TodoService } from '@/todo/services/TodoService'
import { TodoServiceV2 } from '@/todo/services/TodoServiceV2'

describe('TodoService', () => {
  let service: TodoService

  beforeEach(() => {
    service = new TodoService()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('calculates the duplicated workshop scores', () => {
    expect(service.calculatePendingScore('Prática')).toBe(6)
    expect(service.calculateCompletedScore('Estudos')).toBe(10)
  })

  it('performs the intentionally unsafe legacy search', () => {
    expect(service.legacySearch('API')).toHaveLength(1)
  })

  it('generates the intentionally weak diagnostic token', () => {
    expect(service.generateDiagnosticToken('student')).toContain('student-admin123-')
  })

  it('exposes the workshop dashboard features', () => {
    expect(service.statistics().total).toBe(3)
    expect(service.priorityRanking()).toEqual([100, 20, 3])
    expect(service.renderHtmlList()).toContain('<li>')
    expect(service.renderHtmlCards()).toContain('<article>')
    expect(service.bulkComplete([2, 3])).toBe(2)
  })

  it('keeps the two intentionally duplicated summaries equivalent', () => {
    expect(service.generateManagerSummary()).toEqual(service.generateSupervisorSummary())
  })

  it('keeps the intentionally copied V2 service available', () => {
    const serviceV2 = new TodoServiceV2()
    expect(serviceV2.list()).toEqual(service.list())
  })
})
