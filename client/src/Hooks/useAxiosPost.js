import axios from "axios";

async function useSignUp(url, data) {
    try {
        const response = await axios.post(`http://localhost:8000/${url}`, data);
        return response.status;
    } catch (error) {
        console.log(error);
    }
}


export {  useSignUp }






