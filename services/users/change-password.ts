import { headers } from "services/headers";
import { ChangePasswordRequest, ChangePasswordResponse } from "services/types/users";

const changePassword = async (payload: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    try {
        const data = await fetch('http://localhost:8000/users/change-password', {
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

export default changePassword;