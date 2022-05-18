import { getToken } from "@util/helper";
import { headers } from "services/headers";
import { GenericResponse } from "services/types/generic";

const deleteTransaction = async (transactionId: number): Promise<GenericResponse> => {
    try {
        getToken();
        const data = await fetch(`http://localhost:3000/transactions/${transactionId}`, {
            method: 'DELETE',
            ...headers
        });

        const json = await data.json();
        return json;
    } catch(e) {
        console.log(e);
    }
};

export default deleteTransaction;