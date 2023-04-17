import { Card } from 'primereact/card';
import { Calendar } from 'primereact/calendar';
import React, { useRef, useState, useEffect } from 'react';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';
import { Button } from 'primereact/button';
import { InputText } from "primereact/inputtext";
import { Toast } from 'primereact/toast';
import { RadioButton } from "primereact/radiobutton";
import { fetchData, postData } from "../Hooks/useAxiosGet";
import { Dropdown } from 'primereact/dropdown';

const tenant = { building_id: 1, entry_id: 1 }
export default function AddVote(params) {

    const [data, setData] = useState([]);
    const [objToData, setObjToData] = useState({ building_id: tenant.building_id/*, end_date: new Date().toISOString().slice(0,10)*/});
    const [date, setDate] = useState(null);
    var date2 = null;
    const [visible, setVisible] = useState(false);
    const [value, setValue] = useState('');
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
        if (myData){
            setSelectedOption(myData[0]);
            handleChange(myData[0].id, "vote_type_id");
        }
    }

    const getEntries = async (url) => {
        const myData = await fetchData(url);
        console.log("entries", myData);
        setEntries(myData);
        // if(myData){
        //     setSelectedDrop(myData[0])
        // }
    }

    useEffect(() => {
        getEntries(`entry?building_id=${tenant.building_id}`);
        getOptions(`voteTypes?building_id=${tenant.building_id}`);
    }, [])

    const handleChange = async(selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));           
    }

    useEffect(()=>{
        console.log("objToData", objToData); 
    }, [objToData])

    const accept = () => {
        postData(`vote`, objToData);
        toast.current.show({ severity: 'info', summary: 'Confirmed', detail: 'המידע נשלח בהצלחה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'המידע לא נשלח', life: 3000 });
    };

    return (
        <div style={{ padding: "5%" }}>
            <Card title="הוסף הצבעה" style={{ width: "50%" }}>
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>נושא </span>
                <InputText
                    value={value}
                    onChange={(e) => {
                        setValue(e.target.value);
                        handleChange(e.target.value, "subject")
                    }}
                    style={{ width: "250px" }}
                />

                <br /><br /><br />
                <span style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}>אפשרויות מענה </span><br /><br />
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
                </div><br /><br /><br />

                <span style={{ fontSize: "1.3rem", fontWeight: "700", marginBottom: "0.5rem" }}> למי תהיה אפשרות הצבעה </span><br /><br />
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
                                                console.log("e.value.des", e.value.des);
                                                if(e.value.des=="לכל דיירי/ות הבניין"){
                                                    handleChange(tenant.building_id, "building_id");
                                                    handleChange(null, "entry_id");
                                                    console.log("obj", objToData);
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
                            {showDrop?
                            <Dropdown
                                value={selectedDrop}
                                onChange={(e) => {
                                        setSelectedDrop(e.value);
                                        handleChange(e.value.id, "entry_id");
                                        debugger;
                                        console.log("obj", objToData);
                                    }
                                }
                                options={entries/*.map(e=> e.nickname)*/}
                                optionLabel = "nickname"
                                placeholder="נא לבחור את הכניסה הרצויה"
                                className="w-full md:w-14rem"
                                style={{ width: "40%" }}
                            />:<></> }
                        </div> : <></>}
                </div><br /><br /><br />
                <span>תאריך סיום </span>
                <Calendar
                    value={date2}//{date}
                    onChange={(e) => {
                        // setDate(e.value.toISOString().slice(0,10));
                        date2 = e.value.toISOString().slice(0,10);
                        console.log(e.value.toISOString().slice(0,10));
                        handleChange(e.value.toISOString().slice(0,10), "end_date");
                    }}
                    showIcon
                    style={{ direction: "ltr" }}
                />
                <br /><br />
                <Toast ref={toast} />
                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                    message="האם הנך בטוח/ה שברצונך ליצור הצבעה חדשה" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                <div className="card flex justify-content-">
                    <Button
                        ref={buttonEl}
                        onClick={() => {
                            // console.log(objToData);
                            setVisible(true);
                        }}
                        icon="pi pi-check"
                        label="הוסף הצבעה"
                    />
                </div>
            </Card>
        </div>
    )
}