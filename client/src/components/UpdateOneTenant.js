import React, { useContext, useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import '../Css/FormDemo.css';
import { fetchData, putData } from '../Hooks/useAxiosGet';
import { Dropdown } from 'primereact/dropdown';
import UpdateTenant from './UpdateTenant';
import UserContext from './UserContext';

// const tenant = { apartment_id: 1 }
export default function UpdateOneTenant() {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const [items, setItems] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [objToData, setObjToData] = useState({ Is_building_comittee: false, apartment_id: tenant.apartment_id });
    const toast = useRef(null);
    const buttonEl = useRef(null);
    const [visible, setVisible] = useState(false);
    const [id, setId] = useState(null);
    const [name, setName] = useState(null);
    const [email, setEmail] = useState(null);
    const [birth_date, setBirth_date] = useState(null);
    const [phone, setPhone] = useState(null);
    const [car_id, setCar_id] = useState(null);

    const getItems = async (url) => {
        const myData = await fetchData(url);
        setItems(myData);
        if (myData) {
        }
    }

    useEffect(() => {
        getItems(`tenant/byApartment/${tenant?.apartment_id}`);
    }, [])

    useEffect(() => {
        if (selectedItem != null) {
            var carId = "לא קיים מספר רכב"
            if (selectedItem.car_id != null)
                carId = selectedItem.car_id 
            var x = {
                "id": selectedItem.id,
                "name": selectedItem.name,
                "birth_date": selectedItem.birth_date,
                "email": selectedItem.email,
                "phone": selectedItem.phone,
                "apartment_id": selectedItem.apartment_id,
                "Is_building_comittee": selectedItem.Is_building_comittee,
                "car_id": selectedItem.car_id
            };
            setId(selectedItem.id);
            setName(selectedItem.name);
            setBirth_date(selectedItem.birth_date);
            setEmail(selectedItem.email);
            setPhone(selectedItem.phone);
            setCar_id(carId);
            setObjToData(x);
        }
    }, [selectedItem])

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const accept = async () => {
        const res = await putData(`tenant/${objToData.id}`, objToData);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'info', detail: 'השינויים נשמרו בהצלחה', life: 3000 });
        }
        else {
            toast.current.show({ severity: 'warn', detail: "בעיה בעדכון נתונים", life: 3000 });
        }
    };


    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'פרטי הדייר/ת לא נשמרו', life: 3000 });
    };

    return (
        <div >
            <div className="flex justify-content-center">
                    <Card title="עדכון פרטי דייר" className='flex flex-wrap' style={{ width: "30%", minHeight: "30%" }}>
                        <span className="p-float-label">
                            <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>בחר דייר  </span>
                            <Dropdown value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={items} optionLabel="name"
                                placeholder="בחר דייר" className="w-full md:w-14rem" />
                        </span>
                        <br></br>
                        <UpdateTenant selectedItem={selectedItem}></UpdateTenant>
                    </Card>
                </div>
        </div>
    );
}