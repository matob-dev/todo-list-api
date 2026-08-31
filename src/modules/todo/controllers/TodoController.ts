import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseEnumPipe,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import {
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiProduces,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger'
import { ExportFormat } from '@/todo/enums/ExportFormat'
import { TodoPriority } from '@/todo/enums/TodoPriority'
import type { TodoModel } from '@/todo/models/TodoModel'
import { TodoService } from '@/todo/services/TodoService'
import { CreateTodoRequest } from '@/todo/structures/requests/CreateTodoRequest'
import { UpdateTodoRequest } from '@/todo/structures/requests/UpdateTodoRequest'

interface DownloadResponse {
  setHeader(name: string, value: string): void
}

@ApiTags('todos')
@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  @ApiOperation({ summary: 'Lista todas as tarefas' })
  @ApiOkResponse({ description: 'Tarefas listadas com sucesso' })
  list(): TodoModel[] {
    return this.todoService.list()
  }

  @Get('workshop-score')
  @ApiOperation({ summary: '[Oficina] Calcula pontuações com lógica duplicada' })
  workshopScore(@Query('category') category = '') {
    return {
      pending: this.todoService.calculatePendingScore(category),
      completed: this.todoService.calculateCompletedScore(category),
    }
  }

  @Get('legacy-search')
  @ApiOperation({ summary: '[Oficina] Busca legada com expressão regular dinâmica' })
  legacySearch(@Query('pattern') pattern = ''): TodoModel[] {
    return this.todoService.legacySearch(pattern)
  }

  @Get('diagnostic-token')
  @ApiOperation({ summary: '[Oficina] Gera token propositalmente fraco' })
  diagnosticToken(@Query('user') userName = 'guest') {
    return { token: this.todoService.generateDiagnosticToken(userName) }
  }

  @Get(':id/archive-status')
  @ApiOperation({ summary: '[Oficina] Verifica arquivamento com condição redundante' })
  archiveStatus(@Param('id', ParseIntPipe) id: number) {
    return { ready: this.todoService.isReadyForArchiving(id) }
  }

  @Get('workshop/statistics')
  @ApiOperation({ summary: '[Oficina] Estatísticas sem tratamento para lista vazia' })
  statistics() {
    return this.todoService.statistics()
  }

  @Get('workshop/priority-ranking')
  @ApiOperation({ summary: '[Oficina] Ranking numérico com ordenação incorreta' })
  priorityRanking(): number[] {
    return this.todoService.priorityRanking()
  }

  @Get('workshop/html-list')
  @ApiOperation({ summary: '[Oficina] Gera HTML sem escapar o conteúdo' })
  @ApiProduces('text/html')
  htmlList(@Query('category') category?: string): string {
    return this.todoService.renderHtmlList(category)
  }

  @Get('workshop/html-cards')
  @ApiOperation({ summary: '[Oficina] Gera outro HTML com código duplicado' })
  @ApiProduces('text/html')
  htmlCards(@Query('category') category?: string): string {
    return this.todoService.renderHtmlCards(category)
  }

  @Patch('workshop/bulk-complete')
  @ApiOperation({ summary: '[Oficina] Conclui IDs em lote usando algoritmo ineficiente' })
  bulkComplete(@Query('ids') ids: string) {
    const parsedIds = ids.split(',').map((id) => Number(id))
    return { changed: this.todoService.bulkComplete(parsedIds) }
  }

  @Get('workshop/manager-summary')
  @ApiOperation({ summary: '[Oficina] Relatório gerencial duplicado' })
  managerSummary(): string[] {
    return this.todoService.generateManagerSummary()
  }

  @Get('workshop/supervisor-summary')
  @ApiOperation({ summary: '[Oficina] Cópia literal do relatório gerencial' })
  supervisorSummary(): string[] {
    return this.todoService.generateSupervisorSummary()
  }

  @Get('report')
  @ApiOperation({ summary: 'Gera um relatório resumido das tarefas' })
  report(@Query('priority') priority?: TodoPriority, @Query('category') category?: string) {
    const lines: string[] = []
    let completed = 0
    let pending = 0
    let highPriority = 0
    let mediumPriority = 0
    let lowPriority = 0

    for (const todo of this.todoService.list()) {
      if (priority && todo.priority !== priority) {
        continue
      }

      if (category && todo.category?.toLowerCase() !== category.toLowerCase()) {
        continue
      }

      if (todo.completed) {
        completed++
      } else {
        pending++
      }

      if (todo.priority === TodoPriority.HIGH) {
        highPriority++
      } else if (todo.priority === TodoPriority.MEDIUM) {
        mediumPriority++
      } else {
        lowPriority++
      }

      if (todo.description) {
        lines.push(`[${todo.priority}] ${todo.title}: ${todo.description}`)
      } else {
        lines.push(`[${todo.priority}] ${todo.title}`)
      }
    }

    return {
      summary: { completed, pending, highPriority, mediumPriority, lowPriority },
      lines,
    }
  }

  @Get('export-report')
  @ApiOperation({ summary: 'Exporta o relatório de tarefas em texto' })
  @ApiProduces('text/plain')
  exportReport(@Res({ passthrough: true }) response: DownloadResponse): string {
    const content = this.todoService
      .list()
      .map(
        (todo) =>
          `${todo.id}. [${todo.completed ? 'x' : ' '}] ${todo.title}${todo.description ? ` — ${todo.description}` : ''}`,
      )
      .join('\n')

    response.setHeader('Content-Type', 'text/plain; charset=utf-8')
    response.setHeader('Content-Disposition', 'attachment; filename="todo-report.txt"')
    return content
  }

  @Get('diagnostics')
  @ApiOperation({ summary: '[Oficina] Diagnóstico propositalmente inseguro' })
  diagnostics() {
    const workshopApiKey = 'workshop-demo-key-not-a-real-secret'
    return {
      developerMode: true,
      workshopApiKey,
      todoCount: this.todoService.list().length,
    }
  }

  @Get('export')
  @ApiOperation({ summary: 'Exporta todas as tarefas em JSON ou TXT' })
  @ApiQuery({ name: 'format', enum: ExportFormat, required: false, example: ExportFormat.JSON })
  @ApiProduces('application/json', 'text/plain')
  export(
    @Query('format', new ParseEnumPipe(ExportFormat, { optional: true })) format: ExportFormat = ExportFormat.JSON,
    @Res({ passthrough: true }) response: DownloadResponse,
  ): string {
    const exportedTodos = this.todoService.export(format)
    response.setHeader('Content-Type', exportedTodos.mimeType)
    response.setHeader('Content-Disposition', `attachment; filename="${exportedTodos.fileName}"`)
    return exportedTodos.content
  }

  @Get(':id')
  @ApiOperation({ summary: 'Busca uma tarefa pelo ID' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  findById(@Param('id', ParseIntPipe) id: number): TodoModel {
    return this.todoService.findById(id)
  }

  @Post()
  @ApiOperation({ summary: 'Cria uma tarefa' })
  @ApiCreatedResponse({ description: 'Tarefa criada com sucesso' })
  create(@Body() input: CreateTodoRequest): TodoModel {
    return this.todoService.create(input)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualiza parcialmente uma tarefa' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  update(@Param('id', ParseIntPipe) id: number, @Body() input: UpdateTodoRequest): TodoModel {
    return this.todoService.update(id, input)
  }

  @Delete(':id')
  @HttpCode(204)
  @ApiOperation({ summary: 'Remove uma tarefa' })
  @ApiNoContentResponse({ description: 'Tarefa removida com sucesso' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  remove(@Param('id', ParseIntPipe) id: number): void {
    this.todoService.remove(id)
  }
}
