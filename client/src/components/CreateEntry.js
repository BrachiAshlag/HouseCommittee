import React, { useRef, useState, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchData, postData, deleteData, putData } from '../Hooks/useAxiosGet';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import UserContext from './UserContext';
import { useNavigate } from "react-router-dom";
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';



// const tenant = {building_id: 34}

const CreateEntry = () => {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [admin, setAdmin] = useState(null);
    const navigate = useNavigate();

    const [objToData, setObjToData] = useState({
        building_id: tenant?.building_id,
        nickname: null,
        num_of_apartment: null,
        num_of_floors: null
    });

    const [nickname, setNickname] = useState(null);
    const [num_of_apartment, setNum_of_apartment] = useState(null);
    const [num_of_floors, setNum_of_floors] = useState(null);
    const [entries, setEntries] = useState([]);
    const [visible, setVisible] = useState(false);
    const [visiblePop, setVisiblePop] = useState(false);
    const [addEntry, setAddEntry] = useState(false);
    const [entry, setEntry] = useState(false);
    const [status, setStatus] = useState(null);

    const buttonEl = useRef(null);
    const toast = useRef(null);
    const buttonElDelete = useRef(null);

    const accept = async () => {
        debugger;
        const res = await deleteData(`entry/${entry?.id}`)
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'הכניסה נמחקה בהצלחה', life: 3000 });
            setEntry(null);
        }
        else
            toast.current.show({ severity: 'error', detail: 'לא נבחרה כניסה למחיקה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'הכניסה לא נמחקה', life: 3000 });
    };

    const getEntries = async (url) => {
        const myData = await fetchData(url);
        setEntries(myData);
    }

    useEffect(() => {
        if (!tenant)
            setAdmin(JSON.parse(localStorage.getItem("admin")));
    }, [tenant])

    useEffect(() => {

        if (admin?.building_id) {
            handleChange(admin?.building_id, "building_id")
        }
    }, [admin])

    useEffect(() => {
        if (tenant?.building_id) {
            getEntries(`entry?building_id=${tenant.building_id}`);
        }
        else if (admin?.building_id) {
            getEntries(`entry?building_id=${admin.building_id}`);
        }
    }, [tenant, admin, visiblePop])

    useEffect(() => {
        if (addEntry) {
            CreateEntry();
            setAddEntry(false);
        }
    }, [addEntry])

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }))
    }

    const CreateEntry = async () => {
        await postData(`entry`, objToData);
        if (tenant?.building_id)
            getEntries(`entry?building_id=${tenant.building_id}`);
        else if (admin?.building_id)
            getEntries(`entry?building_id=${admin.building_id}`);
    }

    const editTheEntry = async () => {
        debugger;
        const res = await putData(`entry/${entry.id}`, objToData);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'הכניסה שונתה בהצלחה', life: 3000 });
            setEntry(null);
        }
        else
            toast.current.show({ severity: 'error', detail: 'לא נבחרה כניסה לשינוי', life: 3000 });

        if (tenant?.building_id)
            getEntries(`entry?building_id=${tenant.building_id}`);
        else if (admin?.building_id)
            getEntries(`entry?building_id=${admin.building_id}`);
    }



    const edit = (rowData) => {
        debugger;
        setStatus("edit");
        setNickname(rowData?.nickname);
        handleChange(rowData?.nickname, "nickname");
        setNum_of_apartment(rowData?.num_of_apartment);
        handleChange(rowData?.num_of_apartment, "num_of_apartment");
        setNum_of_floors(rowData?.num_of_floors);
        handleChange(rowData?.num_of_floors, "num_of_floors");
        setVisible(true);
    }

    const create = () => {
        setStatus("create");
        setNickname(null);
        handleChange(null, "nickname");
        setNum_of_apartment(null);
        handleChange(null, "nickname");
        setNum_of_floors(null);
        handleChange(null, "nickname");
        setVisible(true);
    }

    const actionBodyTemplate = (rowData) => {
        return (<>
            <Button icon="pi pi-pencil" rounded outlined onClick={() => { debugger; setEntry(rowData); edit(rowData); }} style={{ margin: "3px" }} />
            <Toast ref={toast} />
            <ConfirmPopup target={buttonElDelete.current} visible={visiblePop} onHide={() => setVisiblePop(false)}
                message="האם הנך בטוח/ה שברצונך למחוק את הכניסה שבחרת" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
            <Button icon="pi pi-trash" ref={buttonElDelete} rounded outlined severity="danger" onClick={() => { setEntry(rowData); setVisiblePop(true); }} style={{ margin: "3px" }} />
        </>)
    };

    return (
        <>
            {
                <div className="flex justify-content-center" style={{ padding: "5%" }}>
                    <Card /*title="ניהול הכניסות"*/ style={{ width: "70%" }}>
                        <div className='flex justify-content-between'>
                        <h2 className='flex align-item-start'>ניהול הכניסות</h2>
                        <span>
                            <Button
                                ref={buttonEl}
                                onClick={() => {
                                    create();
                                }}
                                icon="pi pi-plus"
                                label="הוספת כניסה"
                                rounded
                                severity="success"
                                // outlined
                                style={{ margin: "3px", direction: "ltr" }}
                            />
                        </span>
                        </div>
                        {entries?.length > 0 ?
                            <>
                                <div className="card">
                                    <DataTable
                                        value={entries}
                                        tableStyle={{ minWidth: '50rem' }}
                                    >
                                        <Column field="nickname" header="כינוי" style={{ width: '20%' }} className='text-right' ></Column>
                                        <Column field="num_of_apartment" header="מספר דירות" style={{ width: '20%' }} className='text-right'></Column>
                                        <Column field="num_of_floors" header="מספר קומות" style={{ width: '20%' }} className='text-right'></Column>
                                        <Column bodyStyle={{ overflow: 'visible', width: '20%' }} body={actionBodyTemplate} />
                                    </DataTable>
                                </div>
                            </> :
                            <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>לא מוגדרות כניסות לבניין שלך </span>
                        }
                        <br /><br />
                        <div className='flex-wrap'>
                            {admin &&
                                <span>
                                    <Button
                                        ref={buttonEl}
                                        onClick={() => {
                                            navigate("/addTenant");
                                        }}
                                        icon="pi pi-save"
                                        label="סיום"
                                        style={{ margin: "3px", direction: "ltr" }}
                                    />
                                </span>
                            }
                        </div>
                        <Dialog visible={visible} style={{ width: '50vw', direction: 'rtl' }} onHide={() => setVisible(false)} >
                            {status == "edit" ? <h2>עריכת כניסה</h2> : <h2>יצירת כניסה</h2>}
                            <div className="flex flex-column gap-3">
                                <span>
                                    <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>כינוי: </span>
                                    <InputText
                                        id="nickname"
                                        value={nickname}
                                        onChange={(e) => {
                                            setNickname(e.target.value)
                                            handleChange(e.target.value, "nickname")
                                        }}
                                    />
                                </span>
                                <span>
                                    <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר דירות: </span>
                                    <InputNumber
                                        inputId="withoutgrouping"
                                        value={num_of_apartment}
                                        onValueChange={(e) => {
                                            setNum_of_apartment(e.target.value);
                                            handleChange(e.target.value, "num_of_apartment")
                                        }}
                                        useGrouping={false}
                                    />
                                </span>
                                <span>
                                    <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר קומות: </span>
                                    <InputNumber
                                        inputId="withoutgrouping"
                                        value={num_of_floors}
                                        onValueChange={(e) => {
                                            setNum_of_floors(e.target.value);
                                            handleChange(e.target.value, "num_of_floors")
                                        }}
                                        useGrouping={false}
                                    />
                                </span>
                                <span>
                                    {status == "edit" ?
                                        <Button
                                            ref={buttonEl}
                                            onClick={() => {
                                                editTheEntry();
                                                setVisible(false);
                                            }}
                                            icon="pi pi-file-edit"
                                            label="עריכת הכניסה"
                                            style={{ direction: "ltr"}}
                                        /> :
                                        <Button
                                            ref={buttonEl}
                                            onClick={() => {
                                                setAddEntry(true);
                                                setVisible(false);
                                            }}
                                            icon="pi pi-file-edit"
                                            label="יצירת הכניסה"
                                            style={{ direction: "ltr"}}
                                        />}
                                </span>
                            </div>
                        </Dialog>
                    </Card>
                </div>
            }
        </>
    )
}

export default CreateEntry;