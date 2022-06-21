import { RegisterRequest, RegisterResponse } from "services/types/users";

const registerUser = async (payload: RegisterRequest): Promise<RegisterResponse> => {
    try {
        const data = await fetch('http://localhost:8000/users/register', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default registerUser;