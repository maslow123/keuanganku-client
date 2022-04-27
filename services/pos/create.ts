import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { CreatePosRequest, CreatePosResponse } from "services/types/pos";

const create = async (payload: CreatePosRequest): Promise<CreatePosResponse> => {
    try {
        getToken();
        const data = await fetch('http://localhost:3000/pos/create', {
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