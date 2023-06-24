import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import '../Css/FormDemo.css';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { fetchData, putData } from '../Hooks/useAxiosGet';
import { Dropdown } from 'primereact/dropdown';
import UserContext from './UserContext';

// const tenant = { apartment_id: 1 }
export default function UpdateTenant() {
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
            
            toast.current.show({ severity: 'success', detail: 'השינויים נשמרו בהצלחה', life: 3000 });
        }
        else {
            
    
            toast.current.show({ severity: 'error', detail: "בעיה בעדכון נתונים", life: 3000 });
        }
    };


    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'פרטי הדייר/ת לא נשמרו', life: 3000 });
    };

    return (
        <div >
            <div className="flex justify-content-center">
                <Card title="עדכון פרטי דייר" className="flex justify-content-center" style={{ width: "30%", minHeight: "30%" }}>
                    <span className="p-float-label">
                        <Dropdown id="who" value={selectedItem} onChange={(e) => setSelectedItem(e.value)} options={items} optionLabel="name"
                            style={{direction: "ltr", width: "100%"}}/>
                        <label htmlFor="who">בחר דייר</label>
                    </span>
                    <br></br>
                    
                        {selectedItem ?
                        <>
                        <span className="p-float-label">
                            <InputMask
                                id="id"
                                value={id}
                                mask='999999999'
                                onChange={(e) => {
                                    setId(e.target.value);
                                    handleChange(e.target.value, "id")
                                }}
                                style={{ direction: "ltr", width: "100%" }}
                            />
                            <label htmlFor='id'>*מספר זהות </label>
                            </span>
                        </> : <></>
                        }
                    <br />
                    
                        {selectedItem ?
                            <span className="p-float-label">
                                <InputText
                                    id="name"
                                    value={name}
                                    onChange={(e) => {
                                        setName(e.target.value)
                                        handleChange(e.target.value, "name")
                                    }}
                                    style={{ width: "100%"}}
                                />
                                <label htmlFor='name'>*שם מלא </label>
                            </span> : <></>
                        }
                    
                    <br />
                    
                        {selectedItem ?
                            <span className="p-float-label"> 
                                 <InputText
                                id="email"
                                value={email}
                                onChange={(e) => {
                                    setEmail(e.target.value);
                                    handleChange(e.target.value, "email")
                                }}
                                style={{ width: "100%"}}
                            />
                            <label htmlFor='email'>*אימייל </label>
                            </span>: <></>
                        }      
                    <br />
                    
                        {selectedItem ?
                        <span className="p-float-label">
                            <InputMask
                                id="phone"
                                value={phone}
                                // unmask={true} 
                                onChange={(e) => {
                                    setPhone(e.target.value);
                                    handleChange(e.target.value, "phone")
                                }}
                                mask="999-999-9999"
                                style={{ direction: "ltr", width: "100%" }}
                            />
                            <label htmlFor='phone'>*טלפון נייד </label>
                            </span> : <></>
                        }
                    
                    <br />
                    
                        
                        {selectedItem ?
                            <span className="p-float-label">
                                <Calendar
                                id="date"
                                value={new Date(birth_date)} required
                                onChange={(e) => {
                                    setBirth_date(e.target.value)
                                    handleChange(e.target.value, "birth_date");
                                }
                                }
                                dateFormat="dd/mm/yy"
                                showIcon 
                                style={{ direction: "ltr", width: "100%" }}
                            />
                            <label htmlFor='date'>*תאריך לידה</label>
                            </span> : <></>
                        }                    
                    <br />                                  
                        {selectedItem ?
                            <span className="p-float-label">
                                <InputText
                                id="car"
                                value={car_id}
                                onChange={(e) => {
                                    setCar_id(e.target.value);
                                    handleChange(e.target.value, "car_id")
                                }}
                                style={{ width: "100%"}}
                            />
                            <label htmlFor='car'>*מספר רכב</label>
                            </span> : <></>
                        }
                    
                    <br />
                    {selectedItem ? <>
                        <Toast ref={toast} />
                        <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                            message="האם הנך בטוח/ה שברצונך לעדכן את הדייר/ת שבחרת" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                        <div className="card flex justify-content-">
                            <Button
                                ref={buttonEl}
                                onClick={() => {
                            
                                    setVisible(true);
                                }}
                                icon="pi pi-check-circle"
                                label="עדכן"
                                style={{ width: "100%", direction: "ltr"}}
                            />
                        </div></> : <></>
                    }
                </Card>
            </div>
        </div>
    );
}