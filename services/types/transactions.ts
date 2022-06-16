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
    action: number;
    startDate: number;
    endDate: number;
};

export interface ListTransactionResponse extends ListTransactionRequest, GenericResponse {
    transaction: Transaction[];
    total_transaction: number;
};

export interface DetailTransactionRequest {
    id: number;
};

export interface DetailTransactionResponse extends GenericResponse {
    transaction: Transaction;
};

export interface CreateTransactionRequest {
    pos_id: number;
    total: number;
    details: string;
    action_type: 0 | 1;
    type: 0 | 1;
    date: number;
};

export interface CreateTransactionResponse extends GenericResponse {
    id: number;
};

export interface GetExpenditureRequest {
    start_date: string;
    end_date: string;
};

export interface GetExpenditureResponse extends GenericResponse {
    today_expeses: number;
    other_day_expenses: number;
    percentage: number;
};
