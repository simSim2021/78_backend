// Содержит бизнес логику
// Не работает с req res и express

import { Todo, TodoRepository } from "./todo.entity";

import toTodoDtoResponse from "./todo.mapper";

import { CreateTodoDto } from "./todo.request.dto";

export class TodoService {
  constructor(private readonly repo: TodoRepository) {
    this.repo = repo;
  }
  async getAll(): Promise<Todo[]> {
    return this.repo.findAll();
  }
  async create(todo: CreateTodoDto) {
    return this.repo.create(todo);
  }
  
  async getTodo(id: string, userId: string) {
    const todo = await this.repo.findById(id);
    // todo exists
    if (!todo) {
      throw new Error("Todo not found");
    }
    // check owner
    if (todo.userId !== userId) {
      throw new Error("Forbidden");
    }
    return toTodoDtoResponse(todo);
  }

  async deleteTodo(id: string, userId: string) {
    const todo = await this.repo.findById(id);
    // todo exists
    if (!todo) {
      throw new Error("Todo not found");
    }
    // check owner
    if (todo.userId !== userId) {
      throw new Error("Forbidden");
    }
    await this.repo.delete(id)
    
    return toTodoDtoResponse(todo);
  }

  async updateTodo(id: string, userId: string, title: string) {
  const todo = await this.repo.findById(id);

  // todo exists
  if (!todo) {
    throw new Error("Todo not found");
  }

  // check owner
  if (todo.userId !== userId) {
    throw new Error("Forbidden");
  }

  const updatedTodo = await this.repo.update(id, title);

  if (!updatedTodo) {
    throw new Error("Todo not found");
  }

  return toTodoDtoResponse(updatedTodo);
}
}