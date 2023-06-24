import { Card } from "primereact/card";
import React, { useContext, useEffect, useRef, useState } from "react";
import { deleteData, fetchData, postData } from "../Hooks/useAxiosGet";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { ListBox } from 'primereact/listbox';
import { Toast } from "primereact/toast";
import { ConfirmPopup } from "primereact/confirmpopup";
import UserContext from "./UserContext";

// const tenant = { building_id: 1 }

export default function DefiningLists(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [objToData, setObjToData] = useState({ building_id: tenant.building_id })
    const [selectedDrop, setSelectedDrop] = useState(null);
    const [listToChange, setListToChange] = useState(null);
    const [selectedData, setSelectedData] = useState(null);

    const toastAdd = useRef(null);
    const toastRemove = useRef(null);
    const buttonElAdd = useRef(null);
    const buttonElRemove = useRef(null);

    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleRemove, setVisibleRemove] = useState(false);

    const [data, setData] = useState(null);
    const [value, setValue] = useState("");

    const dropOptions = [
        { id: -1, des: "רשימת תקלות אפשריות" },
        { id: -2, des: "רשימת חודשים לגבייה (לועזיים או עבריים)" },
        { id: -3, des: "רשימת הוצאות קבועות" },
    ];

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const acceptAdd = async () => {
        const res = await postData(`${listToChange}`, objToData)
        if (res == 200 || res == 201) {
            toastAdd.current.show({ severity: 'success', detail: 'הפריט נוסף בהצלחה', life: 3000 });
            setSelectedData(null);
            setValue(null);
        }
        else if (value == "")
            toastAdd.current.show({ severity: 'error', detail: 'שום פריט לא נבחר, יש לנסות שוב', life: 3000 });
        else if (selectedDrop == null)
            toastAdd.current.show({ severity: 'error', detail: 'לא נבחרה רשימה לשינוי, יש לנסות שוב', life: 3000 });
    };

    const rejectAdd = () => {
        toastAdd.current.show({ severity: 'warn', detail: 'הפריט לא נוסף', life: 3000 });
    };

    const acceptRemove = async () => {
        const res = await deleteData(`${listToChange}/${selectedData.id}`);
        if (res == 200 || res == 201) {
            toastRemove.current.show({ severity: 'success', detail: 'הפריט הוסר בהצלחה', life: 3000 });
            setSelectedData(null);
            setValue(null);
        }
        else
            toastRemove.current.show({ severity: 'error', detail: 'שום פריט לא נבחר, יש לנסות שוב', life: 3000 });

    };

    const rejectRemove = () => {
        toastRemove.current.show({ severity: 'warn', detail: 'הפריט לא הוסר', life: 3000 });
    };

    const get = async (url) => {
        var myData = await fetchData(url);
        setData(myData);
    }

    useEffect(() => {

        if (selectedDrop != null) {
            get(`${listToChange}?building_id=${tenant?.building_id}`);
        }
    }, [listToChange, visibleAdd, visibleRemove])

    const itemTemplate = (option) => {

        return (
            <div className="flex justify-content-between flex-wrap">
                <div>{option.description}</div>
                <i className="pi pi-trash flex left-5" title="למחיקה" ref={buttonElRemove} onClick={() => {
                    if (listToChange == "month")
                        handleChange(value, "month");
                    else if (listToChange == "fault" || listToChange == "expensesKind")
                        handleChange(value, "description");
                    setVisibleRemove(true);
                }} style={{ cursor: "pointer" }}></i>
            </div>
        );
    };

    const monthTemplate = (option) => {

        return (
            <div className="flex justify-content-between flex-wrap">
                <div>{option.month}</div>
                <i className="pi pi-trash flex left-5" title="למחיקה" ref={buttonElRemove} onClick={() => {
                    if (listToChange == "month")
                        handleChange(value, "month");
                    else if (listToChange == "fault" || listToChange == "expensesKind")
                        handleChange(value, "description");
                    setVisibleRemove(true);
                }}
                    style={{ cursor: "pointer" }}></i>
            </div>
        );
    };

    return <>
        <div className="card flex justify-content-center align-itrm-center">
            <Card title="הגדרת רשימות עבור הבניין" className="card flex justify-content-center" style={{ width: "50%" }}>
                <br />
                <div className="flex-auto">
                    <span className="p-float-label">
                        <Dropdown
                            value={selectedDrop}

                            onChange={(e) => {
                                setSelectedDrop(e.value);
                                switch (e.value.id) {
                                    case -1:
                                        setListToChange("fault")
                                        break;
                                    case -2:
                                        setListToChange("month")
                                        break;
                                    case -3:
                                        setListToChange("expensesKind")
                                        break;
                                }
                            }
                            }
                            options={dropOptions}
                            optionLabel="des"
                            className="w-full md:w-14rem"
                            style={{ minWidth: "100%", direction: "ltr" }}
                        />
                        <label htmlFor="drop">*נא לבחור את הרשימה לשינוי</label>
                    </span>
                </div>
                <br />
                <div className="field">
                    <span className="p-float-label" style={{ width: "100%" }}>
                        <Button
                            ref={buttonElAdd}
                            onClick={() => {
                                if (listToChange == "month")
                                    handleChange(value, "month");
                                else if (listToChange == "fault" || listToChange == "expensesKind")
                                    handleChange(value, "description");
                                setVisibleAdd(true);
                            }}
                            icon="pi pi-plus"
                            style={{ width: "15%" }} />
                        <InputText value={value} onChange={(e) => setValue(e.target.value)} style={{ direction: "ltr", width: "85%" }} />
                        <label htmlFor="add">*פריט להוספה</label>
                    </span>
                </div>

                {listToChange == "month" && <div className="card flex justify-content-center">
                    <ListBox value={selectedData} onChange={(e) => setSelectedData(e.value)} options={data} optionLabel="month" itemTemplate={monthTemplate} className="w-full md:w-14rem" style={{ minWidth: "100%" }} />
                </div>}
                {(listToChange == "fault" || listToChange == "expensesKind") && <div className="card flex justify-content-center">
                    <ListBox value={selectedData} onChange={(e) => setSelectedData(e.value)} options={data} optionLabel="description" itemTemplate={itemTemplate} className="w-full md:w-14rem" style={{ minWidth: "100%" }} />
                </div>}
                <br />
                <Toast ref={toastAdd} />
                <ConfirmPopup target={buttonElAdd.current} visible={visibleAdd} onHide={() => setVisibleAdd(false)}
                    message="האם הנך בטוח/ה שברצונך להוסיף את הפריט שהקלדת" icon="pi pi-exclamation-triangle" accept={acceptAdd} reject={rejectAdd} />

                <Toast ref={toastRemove} />
                <ConfirmPopup target={buttonElRemove.current} visible={visibleRemove} onHide={() => setVisibleRemove(false)}
                    message="האם הנך בטוח/ה שברצונך להסיר את הפריט שנבחר" icon="pi pi-exclamation-triangle" accept={acceptRemove} reject={rejectRemove} />

            </Card>
        </div>
    </>
}