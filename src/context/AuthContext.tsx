"use client";

import { IUser, LoginBody, RegisterBody } from "@/types/user.types";
import { createContext, useState } from "react";

export interface AuthContextType {
    user: IUser | null;
    loading: boolean;
    login: (data: LoginBody) => Promise<void>;
    register: (data: RegisterBody) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
   const [user, setUser] = useState<IUser | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
};