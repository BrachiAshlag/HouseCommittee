import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState, useEffect, useContext } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { RadioButton } from "primereact/radiobutton";
import { fetchData, postData } from "../Hooks/useAxiosGet";
import { Dropdown } from 'primereact/dropdown';
import { useLocation } from 'react-router-dom';
import UserContext from './UserContext';

// const tenant = { building_id: 1, entry_id: 1 }
export default function AddVote(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));

    const location = useLocation();

    const [data, setData] = useState([]);
    const [objToData, setObjToData] = useState({ building_id: tenant.building_id, subject: location?.state?.subject ? location.state.subject : null });
    const [date, setDate] = useState(null);
    const [value, setValue] = useState(location?.state?.subject ? location.state.subject : "");

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [selectedOption, setSelectedOption] = useState([]);
    const [entries, setEntries] = useState([]);
    const options = [{ id: -1, des: "לכל דיירי/ות הבניין" }, { id: -2, des: "לדיירי/ות כניסה ספציפית" }];
    const [selectedRadio, setSelectedRadio] = useState(options[0]);
    const [showDrop, setShowDrop] = useState(false);
    const [selectedDrop, setSelectedDrop] = useState(null);

    const getOptions = async (url) => {
        const myData = await fetchData(url);
        setData(myData);
        if (myData) {
            setSelectedOption(myData[0]);
            handleChange(myData[0].id, "vote_type_id");
        }
    }

    const getEntries = async (url) => {
        const myData = await fetchData(url);
        setEntries(myData);
    }

    useEffect(() => {
        getEntries(`entry?building_id=${tenant?.building_id}`);
        getOptions(`voteType?building_id=${tenant?.building_id}`);
    }, [])

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const accept = async () => {
        const res = await postData(`vote`, objToData);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'ההצבעה נוספה בהצלחה', life: 3000 });
        }
        else {
            toast.current.show({ severity: 'error', detail: 'ההצבעה לא נשמרה, ישנם פרטים חסרים', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'ההצבעה לא נשמרה', life: 3000 });
    };

    return (
        <div className="card flex justify-content-center">
            <Card title="הוספת הצבעה" style={{ width: "550px" }}>
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>נושא*</span><br />
                <InputText
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleChange(e.target.value, "subject");
                    }}
                    style={{ width: "250px" }}
                /><br />
                <br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>אפשרויות מענה </span><br /><br />
                <div className="card flex">
                    {data ?
                        <div className="flex flex-column gap-3">
                            {data.map((option) => {
                                return (
                                    <div key={option.id} className="flex align-items-center">
                                        <RadioButton
                                            inputId={option.id}
                                            name="option"
                                            value={option}
                                            onChange={(e) => {
                                                setSelectedOption(e.value);
                                                handleChange(e.value.id, "vote_type_id");
                                            }}
                                            checked={selectedOption.id === option.id}
                                        />
                                        <label htmlFor={option.id} className="ml-2">{`${option.positive} או ${option.negative}`}</label>
                                    </div>
                                );
                            })}
                        </div> : <></>}
                </div><br /><br />

                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}> למי תהיה אפשרות הצבעה </span><br /><br />
                <div className="card flex">
                    {data ?
                        <div className="flex flex-column gap-3">
                            {options.map((option) => {
                                return (
                                    <div key={option.id} className="flex align-items-center">
                                        <RadioButton
                                            inputId={option.id}
                                            name="option"
                                            value={option}
                                            onChange={(e) => {
                                                setSelectedRadio(e.value);
                                                if (e.value.des == "לכל דיירי/ות הבניין") {
                                                    handleChange(tenant.building_id, "building_id");
                                                    handleChange(null, "entry_id");
                                                    setShowDrop(false);
                                                }
                                                else {
                                                    handleChange(null, "building_id");
                                                    setShowDrop(true);
                                                }
                                            }}
                                            checked={selectedRadio.id === option.id}
                                        />
                                        <label htmlFor={option.id} className="ml-2">{`${option.des}`}</label>
                                    </div>
                                );
                            })}
                            {showDrop &&
                                <Dropdown
                                    value={selectedDrop}
                                    onChange={(e) => {
                                        setSelectedDrop(e.value);
                                        handleChange(e.value.id, "entry_id");
                                    }
                                    }
                                    options={entries}
                                    optionLabel="nickname"
                                    placeholder="נא לבחור את הכניסה הרצויה"
                                    className="w-full md:w-14rem"
                                    style={{ width: "40%" }}
                                />}
                        </div> : <></>}
                </div><br /><br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>תאריך סיום אפשרות ההצבעה*</span><br />
                <Calendar
                    value={date}
                    onChange={(e) => {
                        setDate(e.value);
                        handleChange(e.value, "end_date");
                    }}
                    dateFormat="dd/mm/yy"
                    showIcon
                    style={{ direction: "ltr" }}
                />
                <br /><br />
                <Toast ref={toast} />
                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                    message="האם הנך בטוח/ה שברצונך ליצור הצבעה חדשה" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                <Button
                    ref={buttonEl}
                    onClick={() => {
                        setVisible(true);
                    }}
                    icon="pi pi-check-circle"
                    label="הוספת הצבעה"
                    style={{ direction: "ltr" }}
                >
                </Button>
            </Card>
        </div>
    )
}