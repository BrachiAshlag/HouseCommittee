import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { RadioButton } from "primereact/radiobutton";
import { postData } from "../Hooks/useAxiosGet";
import { InputTextarea } from "primereact/inputtextarea";
import { useLocation } from 'react-router-dom';
import UserContext from './UserContext';

export default function AddVote(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));

    const location = useLocation();
    const buOrEn = [
        { id: -1, description: "לכל הבניין שלך" },
        { id: -2, description: "רק לכניסה שלך" }
    ]

    const [objToData, setObjToData] = useState({ subject: location?.state?.subject ? location.state.subject : null, description: location?.state?.description ? location.state.description : null });
    const [date, setDate] = useState(null);

    const [value, setValue] = useState(location?.state?.subject ? location.state.subject : "");
    const [content, setContent] = useState(location?.state?.description ? location.state.description : "");

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [selectedOption, setSelectedOption] = useState([]);

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const accept = async () => {
        const res = await postData(`adsBoard`, objToData);
        if (res == 200 || res == 201)
            toast.current.show({ severity: 'success', detail: 'המודעה נוספה בהצלחה', life: 3000 });
        else
            toast.current.show({ severity: 'error', detail: 'המודעה לא נוספה, ישנם פרטים חסרים', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'המודעה לא נוספה', life: 3000 });
    };

    return (
        <div className="card flex justify-content-center">
            <Card title="הוספת מודעה ללוח המודעות" style={{ width: "30%" }}>
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>נושא </span><br />
                <InputText
                    id='subject'
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleChange(e.target.value, "subject")
                    }}
                    style={{ width: "80%" }}
                />

                <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>תוכן המודעה </span><br />
                <InputTextarea
                    id="description"
                    value={content}
                    autoResize
                    onChange={(e) => {
                        setContent(e.target.value);
                        handleChange(e.target.value, "description")
                    }}
                    rows={5}
                    cols={30} />
                <br /><br />

                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>תאריך הסרת המודעה </span><br />
                <Calendar
                    value={date}
                    onChange={(e) => {
                        setDate(e.value);
                        handleChange(e.value, "removal_date");
                    }}
                    showIcon
                    dateFormat="dd/mm/yy"
                    style={{ direction: "ltr" }}
                />
                <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}> באיזה לוח מודעות לשים את המודעה שלך </span><br /><br />
                <div className="flex flex-column gap-3">
                    {buOrEn.map((option) => {
                        return (
                            <div key={option.id} className="flex align-items-center">
                                <RadioButton
                                    inputId={option.id}
                                    name="option"
                                    value={option}
                                    onChange={(e) => {
                                        setSelectedOption(e.value);
                                        switch (e.value.id) {
                                            case -1:
                                                handleChange(tenant.building_id, "building_id")
                                                handleChange(null, "entry_id")
                                                break;

                                            case -2:
                                                handleChange(tenant.entry_id, "entry_id")
                                                handleChange(null, "building_id")
                                                break;
                                        }
                                    }}
                                    checked={selectedOption.id === option.id}
                                />
                                <label htmlFor={option.id} className="ml-2">{option.description}</label>
                            </div>
                        )
                    })}
                </div>
                <br />
                <Toast ref={toast} />
                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                    message="האם הנך בטוח/ה שברצונך ליצור מודעה חדשה" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                <Button
                    ref={buttonEl}
                    onClick={() => {
                        setVisible(true);
                    }}
                    icon="pi pi-check-circle"
                    label="הוספת מודעה"
                    style={{ direction: "ltr" }}
                />

            </Card>
        </div>
    )
}