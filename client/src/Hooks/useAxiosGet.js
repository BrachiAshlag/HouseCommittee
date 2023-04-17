import axios from "axios";

async function fetchData(url) {
    try {
        const response = await axios.get(`http://localhost:8000/${url}`);
        return response.data
    } catch (error) {
        console.log(error);
    }
}

async function postData(url, data) {
    try {
        const response = await axios.post(`http://localhost:8000/${url}`, data);
    } catch (error) {
        console.log(error);
    }
}

export { fetchData, postData }






