import { GenericResponse } from "./generic";

interface User {
    id: number;
    name: string;
    email: string;
};

export interface LoginRequest {
    email: string;
    password: string;
};

export interface LoginResponse extends GenericResponse {
    token: string;
    user: User;
};

export interface RegisterRequest {
    name: string;
    email: string;
    password: string;
    confirm_password: string;
};

export interface RegisterResponse extends GenericResponse, User {}

export interface UpdateRequest {
    name: string;
    email: string;
};

export interface UpdateResponse extends GenericResponse {};

export interface ChangePasswordRequest {
    old_password: string;
    password: string;
    confirm_password: string;
};

export interface ChangePasswordResponse extends GenericResponse {};