import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { ListTransactionRequest, ListTransactionResponse } from "services/types/transactions";


const list = async (query: ListTransactionRequest): Promise<ListTransactionResponse> => {
    try {
        getToken();
        let { startDate: start_date, endDate: end_date } = query;
        if (start_date) { 
            start_date /= 1000;
        }
        if (end_date) { 
            end_date /= 1000;
        }

        const q = new URLSearchParams(query as any).toString().replace('startDate', 'start_date').replace('endDate', 'end_date');
        const data = await fetch(`http://localhost:3000/transactions/list?${q}`, {
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