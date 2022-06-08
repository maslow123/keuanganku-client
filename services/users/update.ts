import { headers } from "services/headers";
import { UpdateRequest, UpdateResponse } from "services/types/users";

const updateUser = async (payload: UpdateRequest): Promise<UpdateResponse> => {
    try {
        const data = await fetch('http://localhost:3000/users/update', {
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

export default updateUser;