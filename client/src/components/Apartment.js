import React from 'react';
import { Card } from 'primereact/card';

const Apartment = (props) => {
    const storages = props.obj.storages;
    const parks = props.obj.parks;
    let s = "";
    for (let i = 0; i < storages.length - 1; i++) {
        const element = storages[i];
        s += element + ", "
    }
    s += storages[storages.length - 1];

    let p = "";
    for (let i = 0; i < parks.length - 1; i++) {
        const element = parks[i];
        p += element + ", "
    }
    p += parks[parks.length - 1];

    return (
        <div style={{ padding: "5%" }}>
            <Card title="צפייה בדירה" style={{ width: "95%" }}>
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>שם איש קשר: </span>
                <label display={"ltr"}> {props.obj.family} </label><br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>כניסה: </span>
                <label>{props.obj.entry}</label> <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>קומה: </span>
                <label>{props.obj.floor}</label> <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר דירה: </span>
                <label>{props.obj.apartmentNum}</label> <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>דוא"ל איש קשר: </span>
                <label style={{ direction: "ltr" }}>{props.obj.email}</label> <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר טלפון: </span>
                <label>{props.obj.phone}</label> <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מחסנים: </span>
                {
                    s !== "undefined" ?
                        <label>{s}</label> : <label>אין</label>
                }
                <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>חניות: </span>
                {
                    p !== "undefined" ?
                        <label>{p}</label> : <label>אין</label>
                }
                <br /><br />
            </Card>
        </div>
    )
}

export default Apartment;