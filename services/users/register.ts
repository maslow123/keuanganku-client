import { RegisterRequest, RegisterResponse } from "services/types/users";
import { mock } from "util/mock";

const registerUser = async (payload: RegisterRequest): Promise<RegisterResponse> => {
    try {
        // const data = await fetch('http://localhost:8000/users/register', {
        //     method: 'POST',
        //     body: JSON.stringify(payload)
        // });

        // const json = await data.json();
        const json: RegisterResponse = mock.users.register;
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default registerUser;