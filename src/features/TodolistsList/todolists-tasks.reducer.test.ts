import {
  addTodolist,
  TodolistDomainType,
  todolistsReducer
} from "features/TodolistsList/todolists.reducer";
import { tasksReducer, TasksStateType } from "features/TodolistsList/tasks.reducer";
import { TodolistType } from "features/TodolistsList/todolists-api";

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {};
  const startTodolistsState: Array<TodolistDomainType> = [];

  let todolist: TodolistType = {
    title: "new todolist",
    id: "any id",
    addedDate: "",
    order: 0,
  };

  type Action = Omit<ReturnType<typeof addTodolist.fulfilled>, "meta">
  const action: Action = {
    type: addTodolist.fulfilled.type,
    payload: {
      todolist: {
        title: "New Todolist",
        id: "any id",
        addedDate: "",
        order: 0,
      }
    }
  }

  const endTasksState = tasksReducer(startTasksState, action);
  const endTodolistsState = todolistsReducer(startTodolistsState, action);

  const keys = Object.keys(endTasksState);
  const idFromTasks = keys[0];
  const idFromTodolists = endTodolistsState[0].id;

  expect(idFromTasks).toBe(action.payload.todolist.id);
  expect(idFromTodolists).toBe(action.payload.todolist.id);
});
