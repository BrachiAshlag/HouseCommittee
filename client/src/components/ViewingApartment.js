import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { useNavigate } from "react-router-dom" 
        
const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

const ViewingApartment = () => {
    const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = useState(null);
    const [filteredItems, setFilteredItems] = useState(null);

    const items = [
        {
            "id": 2,
            "description": "דירה",
            "navigate": "searchByApartment"
        },
        {
            "id": 3,
            "description": "שם",
            "navigate": "searchByName"
        },
        {
            "id": 3,
            "description": "חניה",
            "navigate": "searchByPark"
        },
        {
            "id": 3,
            "description": "מחסן",
            "navigate": "searchByStorage"
        },
        {
            "id": 3,
            "description": "טלפון",
            "navigate": "searchByPhone"
        },
        {
            "id": 3,
            "description": "מספר רכב",
            "navigate": "searchByCarNum"
        }
    ]

    const searchItems = (event) => {
        if(items?.length){
            let query = event.query;
            let _filteredItems = [];

            for(let i = 0; i < items?.length; i++) {
                let item = items[i];
                if (item.description.indexOf(query) === 0) {
                    _filteredItems.push(item);
                }
            }
        setFilteredItems(_filteredItems);
        }
    }

    const navig = () => {
       navigate(`/${selectedItem.navigate}`)
    }

    return (
        <>
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="צפייה בדירה">
                        <span className="p-float-label">
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>סנן לפי </span>
                        <AutoComplete value={selectedItem} suggestions={filteredItems} completeMethod={searchItems} style={{direction:"ltr"}}
                                virtualScrollerOptions={{ itemSize: 38 }} field="description" dropdown onChange={(e) => setSelectedItem(e.value)}/>
                            {/* <label htmlFor="type" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*סוג הוצאה</label> */}
                        </span>
                        <br></br>
                        <Button type="button" label="הצג " className="mt-2" icon = "pi pi-credit-card" onClick={()=>{navig()}}/>
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
}

export default ViewingApartment;
