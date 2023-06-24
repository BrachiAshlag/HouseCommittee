import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import '../Css/FormDemo.css';
import { useNavigate } from "react-router-dom"; 
import { Dropdown } from 'primereact/dropdown';
import UserContext from './UserContext';
        
// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

const ViewingApartment = () => {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = useState(null);

    const items = [
        {
            "description": "דירה",
            "navigate": "searchByApartment"
        },
        {
            "description": "שם",
            "navigate": "searchByName"
        },
        {
            "description": "חניה",
            "navigate": "searchByPark"
        },
        {
            "description": "מחסן",
            "navigate": "searchByStorage"
        },
        {
            "description": "טלפון",
            "navigate": "searchByPhone"
        },
        {
            "description": "מספר רכב",
            "navigate": "searchByCarNum"
        }
    ]

    useEffect(() => {
        if(selectedItem!=null)
            navigate(`/${selectedItem.navigate}`);
    }, [selectedItem])

    return (
        <>
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="צפייה בדירה">
                        <span className="p-float-label">
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>חיפוש לפי </span>
                        <Dropdown style={{ direction: "ltr" }} value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={items} optionLabel="description" 
                            placeholder="דירה" className="w-full md:w-14rem" />
                        </span>
                        <br></br>
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
}

export default ViewingApartment;
