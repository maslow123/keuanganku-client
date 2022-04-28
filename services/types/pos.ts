import { GenericResponse } from "./generic";

interface Pos {
    id: number;
    name: string;
    type: number;
    total: number;
    color: string;
    created_at: number;
    updated_at: number;
};

export interface ListPosRequest {    
    page: number;
    limit: number;
    type: number;
};

export interface ListPosResponse extends ListPosRequest, GenericResponse {
    pos: Pos[];
};

export interface CreatePosRequest {
    id?: number;
    name: string;
    type: 0 | 1;
    color: string;
};

export interface CreatePosResponse extends GenericResponse {
    id: number;
};

export interface UpdatePosRequest extends CreatePosRequest {
    id?: number;
};

export interface UpdatePosResponse extends GenericResponse {
    pos: Pos;
};

export interface DeletePosRequest {
    id: number;
}
export interface DeletePosResponse extends GenericResponse {}