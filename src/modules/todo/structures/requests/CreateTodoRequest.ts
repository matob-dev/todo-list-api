import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

import { TodoPriority } from '@/todo/enums/TodoPriority'

export class CreateTodoRequest {
  @ApiProperty({ example: 'Estudar NestJS' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  title: string

  @ApiPropertyOptional({ example: 'Revisar controllers, providers e módulos.' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string

  @ApiPropertyOptional({ example: 'Estudos' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  category?: string

  @ApiPropertyOptional({ enum: TodoPriority, default: TodoPriority.MEDIUM })
  @IsOptional()
  @IsEnum(TodoPriority)
  priority?: TodoPriority

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  completed?: boolean
}
