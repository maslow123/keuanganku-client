import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { DeletePosRequest, DeletePosResponse } from "services/types/pos";

const deletePos = async (param: DeletePosRequest): Promise<DeletePosResponse> => {
    try {
        getToken();
        const data = await fetch(`http://localhost:3000/pos/${param.id}`, {
            method: 'DELETE',
            ...headers
        });

        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default deletePos;