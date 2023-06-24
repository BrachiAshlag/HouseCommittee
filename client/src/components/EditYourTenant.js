import React, { useContext, useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import '../Css/FormDemo.css';
import { fetchData, putData } from '../Hooks/useAxiosGet';
import UpdateTenant from './UpdateTenant';
import UserContext from './UserContext';

// const tenant = { id: 213843360, apartment_id: 1 };

export default function EditYourTenant(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [ten, setTen] = useState(null);
    const getTenant = async () => {
        const data = await fetchData(`tenant/${tenant?.id}`)
        if (data)
            setTen(data);
    }

    useEffect(() => {
        getTenant();
    }, [])

    return (
        <>
            <div className='flex justify-content-center'>
                <Card title="עריכת פרטייך האישיים" className='flex flex-wrap' style={{ width: "30%" }}>
                    {ten && <UpdateTenant selectedItem={ten}></UpdateTenant>}
                </Card>
            </div>
        </>
    )
}