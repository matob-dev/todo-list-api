import { Module } from '@nestjs/common'

import { TodoController } from '@/todo/controllers/TodoController'
import { TodoService } from '@/todo/services/TodoService'

@Module({
  controllers: [TodoController],
  providers: [TodoService],
})
export class TodoModule {}
