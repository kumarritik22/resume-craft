import { ApiResponse } from "@/types/api.types";
import { LoginBody, RegisterBody } from "@/types/user.types";
import axios from "axios";

const api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    headers: { "Content-Type": "application/json" }
});

export const authService = {
    register: async (data: RegisterBody) => {
        const response = await api.post<ApiResponse>("/auth/register", data);
        return response.data;
    },

    login: async (data: LoginBody) => {
        const response = await api.post<ApiResponse>("/auth/login", data);
        return response.data;
    },

    getMe: async () => {
        const response = await api.get<ApiResponse>("/auth/me");
        return response.data;
    },

    logout: async () => {
        const response = await api.post<ApiResponse>("/auth/logout");
        return response.data;
    }
};

export default api;