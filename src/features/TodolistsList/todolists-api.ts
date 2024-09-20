import { UpdateDomainTaskModelType } from "./tasks.reducer";
import { TaskPriorities, TaskStatuses } from "common/enums";
import { instance } from "common/instance/instance";
import { BaseResponce } from "common/types";

// api
export const todolistsAPI = {
  getTodolists() {
    const promise = instance.get<TodolistType[]>("todo-lists");
    return promise;
  },
  createTodolist(title: string) {
    const promise = instance.post<BaseResponce<{ item: TodolistType }>>("todo-lists", { title: title });
    return promise;
  },
  deleteTodolist(id: string) {
    const promise = instance.delete<BaseResponce>(`todo-lists/${id}`);
    return promise;
  },
  updateTodolist(id: string, title: string) {
    const promise = instance.put<BaseResponce>(`todo-lists/${id}`, { title: title });
    return promise;
  },
  getTasks(todolistId: string) {
    return instance.get<GetTasksResponse>(`todo-lists/${todolistId}/tasks`);
  },
  deleteTask(todolistId: string, taskId: string) {
    return instance.delete<BaseResponce>(`todo-lists/${todolistId}/tasks/${taskId}`);
  },
  createTask(arg: AddTaskArg) {
    const { todolistId, title } = arg;
    return instance.post<BaseResponce<{ item: TaskType }>>(`todo-lists/${todolistId}/tasks`, { title });
  },
  updateTask(todolistId: string, taskId: string, model: UpdateTaskModelType) {
    return instance.put<BaseResponce<TaskType>>(`todo-lists/${todolistId}/tasks/${taskId}`, model);
  },
};

export type UpdateTaskArgs = {
  taskId: string,
  model: UpdateDomainTaskModelType,
  todolistId: string
}

export type AddTaskArg = {
  todolistId: string
  title: string
}

export type RemoveTaskArg = {
  taskId: string,
  todolistId: string
}

export type RemoveTodolistArg = {
  todolistId: string
}

// types
export type TodolistType = {
  id: string;
  title: string;
  addedDate: string;
  order: number;
};

export type TaskType = {
  description: string;
  title: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
  id: string;
  todoListId: string;
  order: number;
  addedDate: string;
};
export type UpdateTaskModelType = {
  title: string;
  description: string;
  status: TaskStatuses;
  priority: TaskPriorities;
  startDate: string;
  deadline: string;
};
type GetTasksResponse = {
  error: string | null;
  totalCount: number;
  items: TaskType[];
};
