import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { DetailTransactionRequest, DetailTransactionResponse } from "services/types/transactions";


const detail = async (transactionId: DetailTransactionRequest): Promise<DetailTransactionResponse> => {
    try {
        getToken();                            
        const data = await fetch(`http://localhost:8000/transactions/detail/${transactionId}`, {
            method: 'GET',
            ...headers
        });
        const json: DetailTransactionResponse = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default detail;