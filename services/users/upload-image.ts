import axios from "axios";
import { headers } from "services/headers";
import { UploadImageResponse } from "services/types/users";

const uploadImage = async (formData: FormData): Promise<UploadImageResponse> => {
    const config = {
        ...headers,
        onUploadProgress: (event) => {
          // console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
        },
    };
    const response: any = await axios.post('http://localhost:3000/users/upload', formData, config);
    return response.data;
};

export default uploadImage;