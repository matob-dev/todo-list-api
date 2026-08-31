import type { TodoPriority } from '@/todo/enums/TodoPriority'

export interface TodoModel {
  id: number
  title: string
  description?: string
  category?: string
  priority?: TodoPriority
  completed: boolean
  createdAt: Date
  updatedAt: Date
}
