import { GenericResponse } from "./generic";
import { Pos } from "./pos";

interface Transaction {
    id: number;
    user_id: number;
    pos_id: number;
    total: number;
    details: string;
    type: 0 | 1;
    created_at: number;
    updated_at: number;
    pos: Pos;
};

export interface ListTransactionRequest {
    page: number;
    limit: number;
};

export interface ListTransactionResponse extends ListTransactionRequest, GenericResponse {
    transaction: Transaction[];
};

export interface CreateTransactionRequest {
    pos_id: number;
    total: number;
    details: string;
    action_type: 0 | 1;
    type: 0 | 1;
};

export interface CreateTransactionResponse extends GenericResponse {
    id: number;
};
