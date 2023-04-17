import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { useNavigate } from "react-router-dom" 
import { fetchData, postData } from "../Hooks/useAxiosGet"
       
const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

const SearchByApartment = () => {
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState(null);
    const [apartments, setApartments] = useState(null);
    
    const get = async (url) => {
        const myData = await fetchData(url);
        setApartments(myData);
    }

    useEffect(() => {
        get(`apartment?building_id=${tenant.building_id}`);
    }, [])

    const searchApartments = (event) => {
        if(apartments?.length){
            let query = event.query;
            let _filteredApartments = [];

            for(let i = 0; i < apartments?.length; i++) {
                let apartment = apartments[i];
                if (apartment.description.toString().indexOf(query)===0) {
                    _filteredApartments.push(apartment);
                }
            }
        setFilteredApartments(_filteredApartments);
        }
    }

    const show = () => {
       return <h1>HELLO!</h1>
    }

    return (
        <>
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="צפייה בדירה">
                        <span className="p-float-label">
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>דירה </span>
                        <AutoComplete value={selectedApartment} suggestions={filteredApartments} completeMethod={searchApartments} style={{direction:"ltr"}}
                                virtualScrollerOptions={{ itemSize: 38 }} field="description" dropdown onChange={(e) => setSelectedApartment(e.value)}/>
                        </span>
                        <br></br>
                        <Button type="button" label="הצג " className="mt-2" icon = "pi pi-credit-card" onClick={()=>{show()}}/>
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
}

export default SearchByApartment;