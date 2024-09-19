import { instance } from "../../../common/instance/instance";
import { BaseResponce } from "common/types/types";
import { LoginParamsType } from "./authApi.types";

export const authAPI = {
  login(data: LoginParamsType) {
    return instance.post<BaseResponce<{ userId?: number }>>("auth/login", data);
  },
  logout() {
    return instance.delete<BaseResponce<{ userId?: number }>>("auth/login");
  },
  me() {
    return instance.get<BaseResponce<{ id: number; email: string; login: string }>>("auth/me");
  },
};

