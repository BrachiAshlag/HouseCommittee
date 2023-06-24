import { InputText } from "primereact/inputtext";
import { useContext, useEffect, useRef, useState } from "react";
import { deleteData, fetchData, postData } from "../Hooks/useAxiosGet";
import { ListBox } from "primereact/listbox";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { AutoComplete } from "primereact/autocomplete";
import { ConfirmPopup } from "primereact/confirmpopup";
import { Toast } from "primereact/toast";
import UserContext from "./UserContext";

// const tenant = { building_id: 1, apartment_id: 1, is_building_committee: false }
export default function AddRemovePark() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [selectedPark, setSelectedPark] = useState(null);
    const [parks, setParks] = useState(null);
    const [value, setValue] = useState("");

    const [selectedApartment, setSelectedApartment] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState(null);
    const [apartments, setApartments] = useState(null);

    const toastAdd = useRef(null);
    const toastRemove = useRef(null);
    const buttonElAdd = useRef(null);
    const buttonElRemove = useRef(null);

    const [visibleAdd, setVisibleAdd] = useState(false);
    const [visibleRemove, setVisibleRemove] = useState(false);

    const [objToData, setObjToData] = useState(!tenant?.is_building_committee ? { apartment_id: tenant?.apartment_id } : {});

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const searchApartments = (event) => {
        if (apartments?.length) {
            let query = event.query;
            let _filteredApartments = [];

            for (let i = 0; i < apartments?.length; i++) {
                let apartment = apartments[i];
                if (apartment.description.toString().indexOf(query) === 0) {
                    _filteredApartments.push(apartment);
                }
            }
            setFilteredApartments(_filteredApartments);
        }
    }

    const get = async () => {

        if (apartments == null && tenant?.is_building_committee) {
            var data = await fetchData(`apartment/description?building_id=${tenant?.building_id}`);
            if (data) {
                data.map(e => e.description = `דירה ${e.apartmentDescription} כניסה ${e.entryDescription}`)
                for (let i = 0; i < data.length; i++) {
                    if (data[i].id == tenant.apartment_id)
                        data[i].description = "הדירה שלך"
                }
                setApartments(data);
            }
        }
        if (selectedApartment != null && tenant?.is_building_committee) { //אם נבחרה דירה יש להציג את החסנים שלה
            const data = await fetchData(`park/byApartment/${selectedApartment.id}`);
            if (data) {
                setParks(data);
            }
        }
        else if (!tenant?.is_building_committee) {
            const data = await fetchData(`park/byApartment/${tenant?.apartment_id}`);
            if (data) {
                setParks(data);
            }
        }
    }

    useEffect(() => {
        get();
    }, [selectedPark, selectedApartment, visibleAdd, visibleRemove])

    const acceptAdd = async () => {
        const res = await postData(`park`, objToData)
        if (res == 200 || res == 201) {
            toastAdd.current.show({ severity: 'success', detail: 'החניה נוספה בהצלחה', life: 3000 });
            setSelectedPark(null);
            setValue(null);
            get();
        }
        else if (!value)
            toastAdd.current.show({ severity: 'error', detail: 'לא נבחרה חניה להוספה, יש לנסות שוב', life: 3000 });
        else if (tenant?.is_building_committee && !objToData.apartment_id)
            toastAdd.current.show({ severity: 'error', detail: 'לא נבחרה דירה, יש לנסות שוב', life: 3000 });
    };

    const rejectAdd = () => {
        toastAdd.current.show({ severity: 'warn', detail: 'החניה לא נוספה', life: 3000 });
    };

    const acceptRemove = async () => {
        const res = await deleteData(`park/${selectedPark.id}`);
        if (res == 200 || res == 201) {
            toastRemove.current.show({ severity: 'success', detail: 'החניה הוסרה בהצלחה', life: 3000 });
            setSelectedPark(null);
            setValue(null);
        }
        else
            toastRemove.current.show({ severity: 'error', detail: 'שום חניה לא נבחרה, יש לנסות שוב', life: 3000 });

    };

    const rejectRemove = () => {
        toastRemove.current.show({ severity: 'warn', detail: 'החניה לא הוסרה', life: 3000 });
    };

    const parkTemplate = (option) => {

        return (
            <div className="flex justify-content-between flex-wrap">
                <div>{option.description}</div>
                <i className="pi pi-trash flex left-5" title="למחיקה" ref={buttonElRemove} onClick={() => { setVisibleRemove(true) }} style={{ cursor: "pointer", color: "#f70f2e" }}></i>
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-content-center">
                <Card title="ניהול החניות" style={{ width: "50%" }} className="flex justify-content-center">
                    <div className="field">
                        {tenant?.is_building_committee && <>
                            <h4>יש לבחור דירה כדי להציג את החניות שלה</h4><br />
                            <span className="p-float-label">
                                <AutoComplete value={selectedApartment} suggestions={filteredApartments} completeMethod={searchApartments} style={{ direction: "ltr", minWidth: "100%" }}
                                    virtualScrollerOptions={{ itemSize: 38 }} field="description" dropdown onChange={(e) => { setSelectedApartment(e.value); handleChange(e.value.id, "apartment_id") }} />
                                <label htmlFor="add" >הדירה אליה שייכת החניה</label>
                            </span>
                            <br />
                        </>}
                        <div className="flex flex-wrap justify-content-center" style={{ width: "100%" }}>
                            <span className="p-float-label" style={{ width: "100%" }}>
                                <Button ref={buttonElAdd} onClick={() => setVisibleAdd(true)} icon="pi pi-plus" style={{ width: "15%" }} />
                                <InputText value={value} onChange={e => { setValue(e.target.value); handleChange(e.target.value, "description") }} style={{ direction: "ltr", width: "85%" }} className="flex-grow-1" />
                                {tenant?.is_building_committee ?
                                    <label htmlFor="add">מספר חניה להוספה לדירה שנבחרה</label> :
                                    <label htmlFor="add">מספר חניה להוספה</label>}
                            </span>
                        </div>
                    </div>
                    {parks && <ListBox value={selectedPark} onChange={(e) => setSelectedPark(e.value)} options={parks} optionLabel="description" itemTemplate={parkTemplate} className="w-full md:w-14rem" listStyle={{ maxHeight: '250px' }} style={{ minWidth: "100%" }} />}
                    <Toast ref={toastRemove} />
                    <ConfirmPopup target={buttonElRemove.current} visible={visibleRemove} onHide={() => setVisibleRemove(false)}
                        message="האם הנך בטוח/ה שברצונך להסיר את החניה שנבחרה" icon="pi pi-exclamation-triangle" accept={acceptRemove} reject={rejectRemove} />

                    <Toast ref={toastAdd} />
                    <ConfirmPopup target={buttonElAdd.current} visible={visibleAdd} onHide={() => setVisibleAdd(false)}
                        message="האם הנך בטוח/ה שברצונך להוסיף את החניה שהקלדת" icon="pi pi-exclamation-triangle" accept={acceptAdd} reject={rejectAdd} />
                </Card>
            </div>
        </>
    )
}