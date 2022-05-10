import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { ListTransactionRequest, ListTransactionResponse } from "services/types/transactions";


const list = async (query: ListTransactionRequest): Promise<ListTransactionResponse> => {
    try {
        getToken();
        const { page, limit } = query;
        const data = await fetch(`http://localhost:3000/transactions/list?page=${page}&limit=${limit}`, {
            method: 'GET',
            ...headers
        });
        const json: ListTransactionResponse = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default list;