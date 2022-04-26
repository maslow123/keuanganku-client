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
    page: number
    limit: number;
};

export interface ListPosResponse extends ListPosRequest, GenericResponse {
    pos: Pos[];
};

export interface CreatePos extends GenericResponse {
    id: number;
};