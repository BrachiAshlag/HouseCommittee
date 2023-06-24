import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { Card } from 'primereact/card';
import '../Css/FormDemo.css';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { deleteData, fetchData, postData, putData } from '../Hooks/useAxiosGet';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import { ListBox } from 'primereact/listbox';
import UserContext from './UserContext';


// const tenant = { building_id: 1, apartment_id: 1, is_building_committee: false }
export default function UpdateApartment() {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const navigate = useNavigate();
    const [formData, setFormData] = useState({});

    const toast = useRef(null);
    const buttonEl = useRef(null);
    const [visible, setVisible] = useState(false);

    const [selectedDropEntry, setSelectedDropEntry] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState(null);

    const [apartment, setApartment] = useState(null);

    const [entries, setEntries] = useState(null);
    const [entry, setEntry] = useState("");
    const [floor, setFloor] = useState("");
    const [resId, setResId] = useState("");
    const [rooms, setRooms] = useState("");
    const [number, setNumber] = useState("");
    const [debt, setDebt] = useState("");
    const [payPerMonth, setPayPerMonth] = useState("");

    const searchEntry = (event) => {
        let query = event.query;
        let _filteredApartmens = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.nickname.indexOf(query) === 0) {
                _filteredApartmens.push(entry);
            }
        }
        setFilteredEntries(_filteredApartmens);
    }

    const get = async () => {
        const data = await fetchData(`entry?building_id=${tenant?.building_id}`);
        if (data) {
            setEntries(data);
        }
    }

    const getApartment = async () => {
        const data = await fetchData(`apartment/byId/${tenant?.apartment_id}`);
        
        if (data) {
            setApartment(data);
            setFloor(data.floor);
            setResId(data.res_tenant_id);
            setRooms(data.num_of_rooms);
            setSelectedDropEntry(data.entry_id);
            setNumber(data.num_of_rooms);
            setDebt(data.debt);
            setPayPerMonth(data.pay_per_month);
        }
    }

    useEffect(() => {
        
        if (entries != null && apartment != null) {
            
            const right = entries.filter(e => e.id == apartment.entry_id);
            setEntry(right[0]);
        }
    }, [entries, apartment])

    useEffect(() => {
        get();
        getApartment();
    }, [ ])

    const handleChange = async (selected, key) => {
        setApartment((prev) => ({ ...prev, [key]: selected }));
    }

    const accept = async () => {
        if (apartment.floor > selectedDropEntry?.floor)
            toast.current.show({ severity: 'error', detail: 'מספר הקומה שהגדרת אינו מוגדר בבניין שלך', life: 3000 });
        else {
            const res = await putData(`apartment/byId/${tenant?.apartment_id}`, apartment);
            if (res == 200 || res == 201)
                toast.current.show({ severity: 'success', detail: 'פרטי הדירה עודכנו בהצלחה', life: 3000 });
            else
                toast.current.show({ severity: 'error', detail: 'פרטי הדירה לא נשמרו, ישנם פרטים חסרים', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'פרטי הדירה לא נשמרו', life: 3000 });
    };

    return (
        <div className="form-demo">
            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="עדכון דירה">

                        <div className="field">
                            <span className="p-float-label">
                                <AutoComplete
                                    id='entry'
                                    disabled={!(tenant.is_building_committee)}
                                    value={selectedDropEntry}
                                    suggestions={filteredEntries}
                                    completeMethod={searchEntry}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="nickname"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedDropEntry(e.value)
                                        handleChange(e.value.id, "entry_id")
                                    }}
                                    style={{ direction: "ltr", minWidth: "100%" }}
                                />
                                <label htmlFor="entry">*כניסה</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputNumber value={resId} useGrouping={false} /*disabled={!(tenant.is_building_committee)}*/
                                    onChange={e => { setResId(e.target.value); handleChange(e.target.value, "res_tenant_id"); }} style={{ minWidth: "100%", direction: "ltr" }} />
                                <label htmlFor="resId">מספר הזהות של איש הקשר</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputNumber value={floor} disabled={!(tenant.is_building_committee)}
                                    onChange={e => { setFloor(e.target.value); handleChange(e.target.value, "floor"); }} /*maxValue={selectedDropEntry?.floor}*/ style={{ minWidth: "100%", direction: "ltr" }} />
                                <label htmlFor="floor">מספר קומה</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="number" value={number} disabled={!(tenant.is_building_committee)} onChange={e => { setNumber(e.target.value); handleChange(e.target.value, "description") }} style={{ minWidth: "100%", direction: "ltr" }} />
                                <label htmlFor="number">מספר דירה</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="rooms" value={rooms} /*disabled*/ onChange={e => { setRooms(e.target.value); handleChange(e.target.value, "num_of_rooms") }} style={{ minWidth: "100%", direction: "ltr" }} />
                                <label htmlFor="rooms">מספר חדרים בדירה</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="number" value={payPerMonth} disabled /*onChange={e => { setPayPerMonth(e.target.value); handleChange(e.target.value, "description") }}*/ style={{ minWidth: "100%", direction: "ltr" }} />
                                <label htmlFor="number">תשלום לחודש</label>
                            </span>
                        </div>
                        <div className="field">
                            <span className="p-float-label">
                                <InputText id="number" value={debt} disabled /*onChange={e => { setDebt(e.target.value); handleChange(e.target.value, "description") }}*/ style={{ minWidth: "100%", direction: "ltr" }} />
                                <label htmlFor="number">חוב</label>
                            </span>
                        </div>
                        
                        <Toast ref={toast} />
                        <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                            message="האם הנך בטוח/ה שברצונך לעדכן את הדירה  שלך" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                        <div className="card flex justify-content-center">
                            <Button type="submit" label="עדכון הדירה" ref={buttonEl} onClick={() => setVisible(true)} className="mt-2" icon="pi pi-home" style={{ minWidth: "100%", direction: "ltr" }} />
                        </div>
                    </Card>
                </div>
            </div>
        </div >
    );
}