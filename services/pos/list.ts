import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { ListPosRequest, ListPosResponse } from "services/types/pos";


const list = async (query: ListPosRequest): Promise<ListPosResponse> => {
    try {
        getToken();        
        const q = new URLSearchParams(query as any).toString();
        const data = await fetch(`http://localhost:8000/pos/list?${q}`, {
            method: 'GET',
            ...headers
        });
        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default list;