import axios from 'axios';
import { useEffect } from 'react';

export async function UseSignIn(url, obj) {
    console.log(obj);
    try {
        const res = await axios.get(`http://localhost:8000/${url}`);
        return res;
    } catch (error) {
        console.log("Error");
        console.log(error);
        return error;
    }
}
