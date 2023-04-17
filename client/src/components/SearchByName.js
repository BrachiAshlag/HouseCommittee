import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { useNavigate } from "react-router-dom" 
import { fetchData } from '../Hooks/useAxiosGet';
        
const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

const SearchByName = () => {
    const [selectedTenant, setSelectedTenant] = useState(null);
    const [filteredTenants, setFilteredTenants] = useState(null);
    const [tenants, setTenants] = useState(null);

    const get = async (url) => {
        const myData = await fetchData(url);
        setTenants(myData);
        if (myData){
            console.log(myData);
        }
    }

    useEffect(() => {
        get(`tenant?building_id=${tenant.building_id}`);
    }, [])

    
    const searchTenants = (event) => {
        if(tenants?.length){
            let query = event.query;
            let _filteredTenants = [];

            for(let i = 0; i < tenants?.length; i++) {
                let tenant = tenants[i];
                if (tenant.name.indexOf(query) === 0) {
                    _filteredTenants.push(tenant);
                }
            }
        setFilteredTenants(_filteredTenants);
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
                    <Card title="צפייה בדירה לפי שם">
                        <span className="p-float-label">
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>שם </span>
                        <AutoComplete value={selectedTenant} suggestions={filteredTenants} completeMethod={searchTenants} style={{direction:"ltr"}}
                                virtualScrollerOptions={{ itemSize: 38 }} field="name" dropdown onChange={(e) => setSelectedTenant(e.value)}/>
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

export default SearchByName;