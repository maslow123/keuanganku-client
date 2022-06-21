import { LoginRequest, LoginResponse } from "services/types/users";

const loginUser = async (payload: LoginRequest): Promise<LoginResponse> => {
    try {
        const data = await fetch('http://localhost:8000/users/login', {
            method: 'POST',
            body: JSON.stringify(payload)
        });

        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default loginUser;