import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { ListTransactionRequest, ListTransactionResponse } from "services/types/transactions";


const list = async (query: ListTransactionRequest): Promise<ListTransactionResponse> => {
    try {
        getToken();
        let { page, limit, action, startDate, endDate } = query;
        if (startDate) { 
            startDate /= 1000;
        }
        if (endDate) { 
            endDate /= 1000;
        }
        const data = await fetch(`http://localhost:3000/transactions/list?page=${page}&limit=${limit}&action=${action}&start_date=${startDate}&end_date=${endDate}`, {
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