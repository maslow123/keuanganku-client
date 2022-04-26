import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { ListPosRequest, ListPosResponse } from "services/types/pos";


const list = async (query: ListPosRequest): Promise<ListPosResponse> => {
    try {
        getToken();
        const { page, limit } = query;
        const data = await fetch(`http://localhost:3000/pos/list?page=${page}&limit=${limit}`, {
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