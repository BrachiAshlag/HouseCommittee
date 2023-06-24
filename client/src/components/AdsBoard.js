import React, { useState, useEffect, useContext } from 'react';
import { fetchData } from '../Hooks/useAxiosGet';
import { Button } from 'primereact/button';
import { Carousel } from 'primereact/carousel';
import UserContext from './UserContext';


// const tenant = { building_id: 1, entry_id: 1 };

export default function AdsBoard() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [ads, setAds] = useState([]);

    const getAds = async () => {
        // const tenant = JSON.parse(localStorage.getItem("tenant"))
        const dataBuilding = await fetchData(`adsBoard?building_id=${tenant?.building_id}`);
        const dataEntry = await fetchData(`adsBoard?entry_id=${tenant?.entry_id}`);
        const all = [...dataBuilding, ...dataEntry];
        setAds(all);
    }

    useEffect(() => {
        getAds();
    }, [])

    const responsiveOptions = [
        {
            breakpoint: '950px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '800px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];


    const adTemplate = (ad) => {
        return (
            <div className="border-1 surface-border border-round m-2 text-center py-5 px-3 h-900rem">
                <div className="mb-3">
                    <i className="pi pi-calendar" style={{ color: "#6366F1" }}></i>
                    <span className="font-semibold">תאריך הסרת המודעה: {ad.removal_date.slice(0, 10)}</span>
                </div>
                <br /><br />
                <div>
                    <h2 className="mb-1">{ad.subject}</h2><br />
                    <h3 className="mt-0 mb-3">{ad.description}</h3>
                </div>
                <br /><br /><br /><br />
                <div className='flex justify-content-center'>
                    {
                        ad?.building_id && <div>
                            <i className="pi pi-building" style={{ color: "#6366F1" }}></i><br />
                            <span className="font-semibold">של כל הבניין</span>
                        </div>
                    }
                    {
                        ad?.entry_id && <div>
                            <i className="pi pi-home" style={{ color: "#6366F1" }}></i><br />
                            <span className="font-semibold">של הכניסה שלך</span>
                        </div>
                    }
                </div>
            </div>
        );
    };

    return (
        <div style={{ width: "100%" }} /*className='flex justify-content-center'*/>
            <h1 style={{ textAlign: "center", fontSize: "2rem", fontWeight: "700", fontFamily: "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol" }}>לוח מודעות</h1><br />
            <Carousel value={ads} numScroll={1} numVisible={3} autoplayInterval={3000} responsiveOptions={responsiveOptions} itemTemplate={adTemplate} style={{ width: "90%", height: "95%", direction: "ltr" }} />
        </div>
    )
}


