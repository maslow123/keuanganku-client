import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { CreateTransactionRequest, CreateTransactionResponse } from "services/types/transactions";

const create = async (payload: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
    try {
        getToken();
        payload.date = Math.floor(payload.date / 1000);
        const data = await fetch('http://localhost:3000/transactions/create', {
            method: 'POST',
            body: JSON.stringify(payload),
            ...headers
        });

        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default create;