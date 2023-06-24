import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { InputMask } from 'primereact/inputmask';
import '../Css/FormDemo.css';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { fetchData, putData } from '../Hooks/useAxiosGet';
import UserContext from './UserContext';

// const tenant = { apartment_id: 1 }
export default function UpdateTenant(props) {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const [items, setItems] = useState(null);
    
    const selectedItem = props.selectedItem;
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
            <div className="flex justify-content-center flex-column">
                <div>
                    {selectedItem &&
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>*מספר זהות </span>
                    }
                    {selectedItem &&
                        <InputMask
                            id="id"
                            value={id}
                            mask='999999999'
                            onChange={(e) => {
                                setId(e.target.value);
                                handleChange(e.target.value, "id")
                            }}
                            style={{ direction: "ltr" }}
                        />
                    }
                </div>
                <br />
                <div>
                    {selectedItem &&
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>*שם מלא </span>
                    }
                    {selectedItem &&
                        <InputText
                            id="name"
                            value={name}
                            onChange={(e) => {
                                setName(e.target.value)
                                handleChange(e.target.value, "name")
                            }}
                        />
                    }
                </div>
                <br />
                <div>
                    {selectedItem &&
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>*אימייל </span>
                    }
                    {selectedItem &&
                        <InputText
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                                handleChange(e.target.value, "email")
                            }}
                        />
                    }
                </div>
                <br />
                <div>
                    {selectedItem &&
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>*טלפון נייד </span>
                    }
                    {selectedItem &&
                        <InputMask
                            id="phone"
                            value={phone}
                            onChange={(e) => {
                                setPhone(e.target.value);
                                handleChange(e.target.value, "phone")
                            }}
                            mask="999-999-9999"
                            style={{ direction: "ltr" }}
                        />
                    }
                </div>
                <br />
                <div>
                    {selectedItem &&
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>*תאריך לידה  </span>
                    }
                    {selectedItem &&
                        <Calendar
                            id="date"
                            value={new Date(birth_date)} required
                            onChange={(e) => {
                                setBirth_date(e.value);
                                handleChange(e.value, "birth_date");
                            }
                            }
                            dateFormat="dd/mm/yy"
                            showIcon style={{ direction: "ltr" }}
                        />
                    }
                </div>
                <br />
                <div>
                    {selectedItem &&
                        <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר רכב  </span>
                    }
                    {selectedItem &&
                        <InputText
                            id="car"
                            value={car_id}
                            onChange={(e) => {
                                setCar_id(e.target.value);
                                handleChange(e.target.value, "car_id")
                            }}
                        />
                    }
                </div>
                <br />
                {selectedItem && <>
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך לעדכן את הדייר/ת שבחרת" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                    <div className="card">
                        <Button
                            ref={buttonEl}
                            onClick={() => {
                        
                                setVisible(true);
                            }}
                            icon="pi pi-check-circle"
                            label="עדכן"
                            style={{ direction: "ltr" }}
                        />
                    </div></>
                }
            </div>
        </div>
    );
}