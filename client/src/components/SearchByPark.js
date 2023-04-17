import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { useNavigate } from "react-router-dom" 
import { fetchData } from '../Hooks/useAxiosGet';
        
const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }


const SearchByPark = () => { 
    const [selectedPark, setSelectedPark] = useState(null);
    const [filteredParks, setFilteredParks] = useState(null);
    const [parks, setParks] = useState(null);

    const get = async (url) => {
        const myData = await fetchData(url);
        setParks(myData);
        if (myData){
            console.log(myData);
        }
    }

    useEffect(() => {
        get(`park?building_id=${tenant.building_id}`);
    }, [])
    // const parks = [
    //     {
    //         "id": 1,
    //         "apartment_id": 2,
    //         "description": 15
    //     },
    //     {
    //         "id": 2,
    //         "apartment_id": 2,
    //         "description": 16
    //     },
    //     {
    //         "id": 3,
    //         "apartment_id": 1,
    //         "description": 54
    //     }
    // ]

    const searchParks = (event) => {
        if(parks?.length){
            let query = event.query;
            let _filteredParks = [];

            for(let i = 0; i < parks?.length; i++) {
                let park = parks[i];
                if (park.description.toString().indexOf(query) === 0) {
                    _filteredParks.push(park);
                }
            }
        setFilteredParks(_filteredParks);
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
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>חניה </span>
                        <AutoComplete value={selectedPark} suggestions={filteredParks} completeMethod={searchParks} style={{direction:"ltr"}}
                                virtualScrollerOptions={{ itemSize: 38 }} field="description" dropdown onChange={(e) => setSelectedPark(e.value)}/>
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

export default SearchByPark;