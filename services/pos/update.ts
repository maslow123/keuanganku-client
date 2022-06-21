import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { UpdatePosRequest, UpdatePosResponse } from "services/types/pos";

const update = async (payload: UpdatePosRequest): Promise<UpdatePosResponse> => {
    try {
        getToken();
        const data = await fetch(`http://localhost:8000/pos/${payload.id}`, {
            method: 'PUT',
            body: JSON.stringify(payload),
            ...headers
        });

        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default update;