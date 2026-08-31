import { Module } from '@nestjs/common'

import { TodoController } from '@/todo/controllers/TodoController'
import { TodoService } from '@/todo/services/TodoService'
import { TodoServiceV2 } from '@/todo/services/TodoServiceV2'

@Module({
  controllers: [TodoController],
  providers: [TodoService, TodoServiceV2],
})
export class TodoModule {}
