import axios from "axios";

async function fetchData(url, data) {
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
        return response.status;
    } catch (error) {
        console.log(error);
    }
}

async function deleteData(url) {
    try {
        const response = await axios.delete(`http://localhost:8000/${url}`);
        return response.status;
    } catch (error) {
        console.log(error);
    }
}

async function putData(url, data) {
    try {
        const response = await axios.put(`http://localhost:8000/${url}`, data);
        return response.status;
    } catch (error) {
        console.log(error);
    }
}

async function getGovIl(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.log(error);
    }
}

export { fetchData, postData, deleteData, putData, getGovIl }






