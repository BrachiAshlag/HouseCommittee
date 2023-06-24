import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { fetchData } from '../Hooks/useAxiosGet';
import Apartment from './Apartment';
import { useNavigate } from "react-router-dom"; 
import { Dropdown } from 'primereact/dropdown';
import UserContext from './UserContext';
        
// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }


const SearchByPark = () => { 
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
     const navigate = useNavigate();

    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedPark, setSelectedPark] = useState(null);
    const [filteredParks, setFilteredParks] = useState(null);
    const [parks, setParks] = useState(null);
    const [apartment, setApartment] = useState(null);
    const [resTenant, setResTenant] = useState(null);
    const [show, setShow] = useState(null);
    const [entry, setEntry] = useState(null);
    const [storages, setStorages] = useState(null);
    const [apart, setApart] = useState(null);

    const getParks = async (url) => {
        const myData = await fetchData(url);
        setParks(myData);

    }

    useEffect(() => {
        getParks(`park?building_id=${tenant?.building_id}`);
    }, [])

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

    const getApartment = async (url) => {
        const myData = await fetchData(url);
        setApartment(myData);

    }

    useEffect(() => {
        if(selectedPark)
            getApartment(`apartment/byId/${selectedPark.apartment_id}`)
    }, [show])

    const get = async (url, s) => {
        const myData = await fetchData(url);
        if(s==="tenant")
            setResTenant(myData);
        if(s==="entry")
            setEntry(myData);
        if(s==="storages")
            setStorages(myData);

    }

    useEffect(() => {
        if(apartment){
            get(`tenant/${apartment.res_tenant_id}`, "tenant");
            get(`entry/${apartment.entry_id}`, "entry");
            get(`storage/byApartment/${apartment.id}`, "storages");
        }
    }, [apartment])

    useEffect(() => {
        if(entry && parks && storages && resTenant){
            const s = storages.map((item) => item.description);
            const p = parks.map((item) => item.description);
            const x={
                family:resTenant.name,
                entry:entry.nickname,
                floor:apartment.floor,
                apartmentNum:apartment.description,
                email:resTenant.email,
                phone:resTenant.phone,
                storages:s,
                parks:p
            }
            setApart(x);
        }
    }, [entry, parks, storages, resTenant])

    const searchParks = (event) => {
        if(parks?.length){
            let query = event.query;
            let _filteredParks = [];

            for(let i = 0; i < parks?.length; i++) {
                let park = parks[i];
                if (park.description && park.description.toString().indexOf(query) === 0) {
                    _filteredParks.push(park);
                }
            }
        setFilteredParks(_filteredParks);
        }
    }

    return (
        <>
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="צפייה בדירה">
                        <span className="p-float-label">
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>חיפוש לפי </span>
                        <Dropdown value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={items} optionLabel="description" 
                            placeholder="דירה" className="w-full md:w-14rem" />
                        </span>
                        <br></br>
                        <span className="p-float-label">
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>חניה </span>
                        <AutoComplete value={selectedPark} suggestions={filteredParks} completeMethod={searchParks} style={{direction:"ltr"}}
                                virtualScrollerOptions={{ itemSize: 38 }} field="description" dropdown onChange={(e) => setSelectedPark(e.value)}/>
                        </span>
                        <br></br>
                        <Button type="button" label="הצגת הדירה שנבחרה " className="mt-2" icon = "pi pi-home" style={{direction: "ltr"}} onClick={()=>{show?setShow(false):setShow(true)}}/>
                        {
                            apart?
                            <Apartment obj={apart} ></Apartment>:<></>
                        }
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
}

export default SearchByPark;