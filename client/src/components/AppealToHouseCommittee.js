import { AutoComplete } from "primereact/autocomplete";
import { Card } from "primereact/card"
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useRef, useState } from "react";
import { fetchData, postData } from "../Hooks/useAxiosGet";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import UserContext from "./UserContext";

// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 };

export default function AppealToHouseCommittee(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [objToData, setObjToData] = useState({ building_id: tenant?.building_id });

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [subject, setSubject] = useState("");
    const [contactSubject, setContactSubject] = useState("");
    const [content, setContent] = useState("");

    const [faults, setFaults] = useState(null);

    const [selectedFault, setSelectedFault] = useState(null);
    const [filteredFaults, setFilteredFaults] = useState(null);

    const searchFault = (event) => {
        let query = event.query;
        let _filteredFaults = [];

        for (let i = 0; i < faults.length; i++) {
            const fault = faults[i];
            if (fault.description.toString().indexOf(query) === 0) {
                _filteredFaults.push(fault);
            }
        }
        setFilteredFaults(_filteredFaults);
    }

    const accept = async () => {
        const res = await postData(`message`, objToData);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'הפנייה לוועד הבית נשלחה בהצלחה', life: 3000 });
        }
        else {
            toast.current.show({ severity: 'error', detail: 'הפנייה לוועד הבית לא נשלחה, ישנם פרטים חסרים', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'הפנייה לא נשלחה', life: 3000 });
    };

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const options = [
        { id: -1, des: "דיווח על תקלה" },
        { id: -2, des: "הצעה להצבעה" },
        { id: -3, des: "הצעה למודעה לפרסום בלוח המודעות" },
        { id: -4, des: "אחר" }
    ];

    const get = async () => {
        const data = await fetchData(`fault?building_id=${tenant?.building_id}`);
        setFaults(data);
    }

    useEffect(() => {
        get();
    }, [])

    return (
        <>
            <div className="flex justify-content-center">
                <Card title="פנייה לוועד הבית" style={{ width: "400px" }}>
                    <div className="field">
                        <span className="p-float-label">
                            <Dropdown
                                value={selectedDrop}
                                onChange={(e) => {
                                    setSelectedDrop(e.value);
                                    if (e.value.id != -4)
                                        handleChange(e.value.des, "title");
                                }}
                                options={options}
                                optionLabel="des"
                                style={{ direction: "ltr", width: "100%" }}
                            />
                            <label htmlFor="subject" >נא לבחור את הנושא הרצוי</label>
                        </span>
                    </div>

                    {selectedDrop?.id == -4 &&
                        <div className="field">
                            <span className="p-float-label">
                                <InputText
                                    id="title"
                                    value={contactSubject}
                                    onChange={e => {
                                        setContactSubject(e.target.value);
                                        handleChange(e.target.value, "title");
                                    }}
                                    style={{ width: "100%" }}
                                />
                                <label htmlFor="title" >נושא הפנייה</label>
                            </span>
                        </div>}

                    {(selectedDrop?.id == -3 || selectedDrop?.id == -2) &&
                        <div className="field">
                            <span className="p-float-label">
                                <InputText
                                    id="subtitle"
                                    value={subject}
                                    onChange={e => {
                                        setSubject(e.target.value);
                                        handleChange(e.target.value, "subtitle");
                                        if (selectedDrop.id == -2)
                                            handleChange(null, "description");
                                    }}
                                    style={{ width: "100%" }}
                                />
                                {selectedDrop?.id == -3 && <label htmlFor="subtitle" >נושא המודעה</label>}
                                {selectedDrop?.id == -2 && <label htmlFor="subtitle" >נושא הפנייה</label>}
                            </span>
                        </div>}

                    {selectedDrop?.id == -1 &&
                        <div className="field">
                            <span className="p-float-label">
                                <AutoComplete
                                    id="fault"
                                    style={{ direction: "ltr", width: "100%" }}
                                    value={selectedFault}
                                    suggestions={filteredFaults}
                                    completeMethod={searchFault}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="description"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedFault(e.value);

                                        if (e.value.id)
                                            handleChange(e.value.description, "subtitle");
                                        else
                                            handleChange(e.target.value, "subtitle");
                                    }}
                                />
                                <label htmlFor="fault">נא לבחור תקלה לדיווח</label>
                            </span>
                        </div>}

                    {(selectedDrop?.id == -3 || selectedDrop?.id == -4) &&
                        <div className="field">
                            <span className="p-float-label">
                                <InputTextarea
                                    id="description"
                                    value={content}
                                    autoResize
                                    onChange={(e) => {
                                        setContent(e.target.value);
                                        handleChange(e.target.value, "description")
                                    }}
                                    rows={5}
                                    cols={30}
                                    style={{ width: "100%" }}
                                />
                                {selectedDrop?.id == -3 && <label htmlFor="description" >גוף המודעה</label>}
                                {selectedDrop?.id == -4 && <label htmlFor="description" >גוף הפנייה</label>}
                            </span>
                        </div>}
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך לשלוח את הפנייה לוועד הבית" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                    <div className="card flex justify-content-center">
                        <Button
                            ref={buttonEl}
                            onClick={() => {
                                setVisible(true);
                            }}
                            icon="pi pi-send"
                            label="שליחת הפנייה"
                            style={{ width: "100%", direction: "ltr" }}
                        />
                    </div>
                </Card>
            </div>
        </>
    )
}