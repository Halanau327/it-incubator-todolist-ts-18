import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  addTodolist, changeTodolistTitle,
  fetchTodolists,
  FilterValuesType, removeTodolist,
  todolistsActions
} from "features/TodolistsList/todolists.reducer";
import { addTask, removeTask, updateTask } from "features/TodolistsList/tasks.reducer";
import { Grid, Paper } from "@mui/material";
import { AddItemForm } from "common/components/AddItemForm/AddItemForm";
import { Todolist } from "./Todolist/Todolist";
import { Navigate } from "react-router-dom";
import { useAppDispatch } from "hooks/useAppDispatch";
import { selectIsLoggedIn } from "features/auth/model/auth.selectors";
import { selectTasks } from "features/TodolistsList/tasks.selectors";
import { selectTodolists } from "features/TodolistsList/todolists.selectors";
import { TaskStatuses } from "common/enums";
import { RemoveTodolistArg, TodolistType } from "./todolists-api";

type PropsType = {
  demo?: boolean;
};

export const TodolistsList: React.FC<PropsType> = ({ demo = false }) => {
  const todolists = useSelector(selectTodolists);
  const tasks = useSelector(selectTasks);
  const isLoggedIn = useSelector(selectIsLoggedIn);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (demo || !isLoggedIn) {
      return;
    }
    const thunk = fetchTodolists(todolists);
    dispatch(thunk);
  }, []);

  const removeTaskCallback = useCallback(function (taskId: string, todolistId: string) {
    dispatch(removeTask({todolistId, taskId}))
  }, []);

  const addTaskCallback = useCallback(function (title: string, todolistId: string) {
    dispatch(addTask({title, todolistId}));
  }, []);

  const changeStatus = useCallback(function(taskId: string, status: TaskStatuses, todolistId: string) {
    dispatch(updateTask({ taskId, model: { status }, todolistId: todolistId }));
  }, []);

  const changeTaskTitle = useCallback(function(taskId: string, title: string, todolistId: string) {
    dispatch(updateTask({ taskId, model: { title }, todolistId }));
  }, []);

  const changeFilter = useCallback(function (filter: FilterValuesType, id: string) {
    dispatch(todolistsActions.changeTodolistFilter({ id, filter }));
  }, []);

  const removeTodolistCallback = useCallback(function (todolistId: string) {
    dispatch(removeTodolist(todolistId));
  }, []);

  const changeTodolistTitleCallback = useCallback(function(todolistId: string, title: string) {
    dispatch(changeTodolistTitle({ todolistId, title }));
  }, []);

  const addTodolistCallback = useCallback(function (title: string) {
   dispatch(addTodolist(title))
  }, [dispatch]);

  if (!isLoggedIn) {
    return <Navigate to={"/login"} />;
  }

  return (
    <>
      <Grid container style={{ padding: "20px" }}>
        <AddItemForm addItem={addTodolistCallback} />
      </Grid>
      <Grid container spacing={3}>
        {todolists.map((tl) => {
          let allTodolistTasks = tasks[tl.id];

          return (
            <Grid item key={tl.id}>
              <Paper style={{ padding: "10px" }}>
                <Todolist
                  todolist={tl}
                  tasks={allTodolistTasks}
                  removeTask={removeTaskCallback}
                  changeFilter={changeFilter}
                  addTask={addTaskCallback}
                  changeTaskStatus={changeStatus}
                  removeTodolist={removeTodolistCallback}
                  changeTaskTitle={changeTaskTitle}
                  changeTodolistTitle={changeTodolistTitleCallback}
                  demo={demo}
                />
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </>
  );
};
