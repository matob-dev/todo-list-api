import { PartialType } from '@nestjs/swagger'

import { CreateTodoRequest } from '@/todo/structures/requests/CreateTodoRequest'

export class UpdateTodoRequest extends PartialType(CreateTodoRequest) {}
