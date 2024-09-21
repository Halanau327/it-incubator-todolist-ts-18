import {
  ChangeTodolistTitleArg,
  todolistsAPI,
  TodolistType
} from "features/TodolistsList/todolists-api";
import { appActions, RequestStatusType } from "app/app.reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { clearTasksAndTodolists } from "common/actions/common.actions";
import { createAppAsyncThunk, handleServerAppError, handleServerNetworkError } from "common/utils";

const initialState: TodolistDomainType[] = [];

const slice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.filter = action.payload.filter;
      }
    },
    changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
      const todo = state.find((todo) => todo.id === action.payload.id);
      if (todo) {
        todo.entityStatus = action.payload.entityStatus;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(clearTasksAndTodolists, () => {
        return [];
      })
      .addCase(fetchTodolists.fulfilled, (state, action) => {
        return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }));
      })
      .addCase(removeTodolist.fulfilled, (state, action) => {
        const index = state.findIndex((todo) => todo.id === action.payload.todolistId);
        if (index !== -1) state.splice(index, 1);
      })
      .addCase(addTodolist.fulfilled, (state, action) => {
        const newTodolist: TodolistDomainType = { ...action.payload.todolist, filter: "all", entityStatus: "idle" };
        state.unshift(newTodolist);
      })
      .addCase(changeTodolistTitle.fulfilled, (state, action) => {
        const todo = state.find((todo) => todo.id === action.payload.todolistId);
        if (todo) {
          todo.title = action.payload.title;
        }
      })
  }
});

export const fetchTodolists = createAppAsyncThunk<{
  todolists: TodolistType[]
}, TodolistType[]>(`${slice.name}/fetchTodolists`, async (arg, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.getTodolists();
    dispatch(appActions.setAppStatus({ status: "succeeded" }));
    return { todolists: res.data };
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const removeTodolist = createAppAsyncThunk<{
  todolistId: string
}, string>(`${slice.name}/removeTodolist`, async (todolistId, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.deleteTodolist(todolistId);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolistId };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const addTodolist = createAppAsyncThunk<{ todolist: TodolistType }, string>(`${slice.name}/addTodolist`, async (title, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.createTodolist(title);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolist: res.data.data.item }
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

export const changeTodolistTitle = createAppAsyncThunk<{
  todolistId: string,
  title: string
}, ChangeTodolistTitleArg>(`${slice.name}/changeTodolistTitle`, async ({ todolistId, title }, thunkAPI) => {
  const { dispatch, rejectWithValue } = thunkAPI;
  try {
    dispatch(appActions.setAppStatus({ status: "loading" }));
    const res = await todolistsAPI.updateTodolist(todolistId, title);
    if (res.data.resultCode === 0) {
      dispatch(appActions.setAppStatus({ status: "succeeded" }));
      return { todolistId, title };
    } else {
      handleServerAppError(res.data, dispatch);
      return rejectWithValue(null);
    }
  } catch (error) {
    handleServerNetworkError(error, dispatch);
    return rejectWithValue(null);
  }
});

// types
export type FilterValuesType = "all" | "active" | "completed";
export type TodolistDomainType = TodolistType & {
  filter: FilterValuesType;
  entityStatus: RequestStatusType;
};

export const todolistsReducer = slice.reducer;
export const todolistsActions = slice.actions;
export const todolistsThunks = { fetchTodolists, removeTodolist };



