import { Module } from '@nestjs/common'

import { TodoModule } from '@/todo/TodoModule'

@Module({
  imports: [TodoModule],
})
export class AppModule {}
