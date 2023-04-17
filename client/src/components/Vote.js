import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../Css/Vote.css'
import { postData } from '../Hooks/useAxiosGet'
const tenant = { id: 213843360 };
export default function Vote(props) {
    const [objToData, setObjToData] = useState({ vote_id: props.allVote.id, tenant_id: tenant.id });

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    useEffect(()=>{
        console.log("useEffect", objToData);
        postData(`tenantVote`, objToData);
    }, [ /*objToData*/ ])

    return (
        <>
            
            <h1 style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>{props.subject}</h1>
            {/*רוצה שירד כאן שורה*/}
            <button
                style={{ border: "none", background: "none" }}
                onClick={() => {
                    //למה זה עובד רק אחרי 2 לחיצות
                    console.log(objToData);
                    handleChange(1, "answer");
                    postData(`tenantVote`, objToData);
                }}>
                <i
                    class="flex align-items-center justify-content-center"
                    id="pos"
                    className="pi pi-fw pi-thumbs-up"
                    style={{ color: '#32CD32', fontSize: '3.5rem', display: "grid" }}
                ></i>
                <div style={{ margin: "4.5%", fontSize: "0.9rem", fontWeight: "700" }}>בעד</div>
            </button>
            <button
                style={{ border: "none", background: "none" }}
                onClick={() => {
                    console.log(objToData);
                    handleChange(0, "answer");
                }}>
                <i
                    class=" flex align-items-center justify-content-center"
                    id="netral"
                    className="pi pi-fw pi-minus-circle"
                    style={{ color: 'grey', fontSize: '3.5rem' }}
                ></i>
                <div style={{ margin: "4.5%", fontSize: "0.9rem", fontWeight: "700" }}>נמנע</div>
            </button>
            <button
                style={{ border: "none", background: "none" }}
                onClick={() => {
                    console.log(objToData);
                    handleChange(-1, "answer");
                }}>
                <i
                    class=" flex align-items-center justify-content-center"
                    id="neg"
                    className="pi pi-fw pi-thumbs-down"
                    style={{ color: '#B22222', fontSize: '3.5rem' }}
                ></i>
                <div style={{ margin: "4.5%", fontSize: "0.9rem", fontWeight: "700" }}>נגד</div>
            </button>

            <br /><br /><br /><br /><br />
        </>
    )
}
