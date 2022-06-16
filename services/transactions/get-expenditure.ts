import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { GetExpenditureRequest, GetExpenditureResponse } from "services/types/transactions";


const getExpenditure = async (query: GetExpenditureRequest): Promise<GetExpenditureResponse> => {
    try {
        getToken();        
        const q = new URLSearchParams(query as any)
                    .toString()
                    .replace('startDate', 'start_date')
                    .replace('endDate', 'end_date');
                    
        const data = await fetch(`http://localhost:3000/transactions/expenditure?${q}`, {
            method: 'GET',
            ...headers
        });
        const json: GetExpenditureResponse = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default getExpenditure;