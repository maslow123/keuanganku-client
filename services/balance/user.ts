import { getToken } from "@util/helper";
import { headers } from "services/headers";


const user = async (): Promise<any> => {
    try {
        getToken();
        const data = await fetch(`http://localhost:8000/balance/user`, {
            method: 'GET',
            ...headers
        });
        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default user;