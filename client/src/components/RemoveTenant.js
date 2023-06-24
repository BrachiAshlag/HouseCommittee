import { Card } from 'primereact/card';
import React, { useContext, useEffect, useRef, useState } from "react";
import { deleteData, fetchData } from '../Hooks/useAxiosGet';
import { Button } from 'primereact/button';
import { AutoComplete } from 'primereact/autocomplete';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import UserContext from './UserContext';


// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function RemoveTenant(props) {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const [tenants, setTenants] = useState(null);

    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [selectedTenant, setSelectedTenant] = useState(null);
    const [id, setId] = useState(null);

    const [filteredTenant, setFilteredTenant] = useState(null);

    const [visible, setVisible] = useState(false);

    const searchTenant = (event) => {
        let query = event.query;
        let _filteredTenant = [];
        
        for (let i = 0; i < tenants.length; i++) {
            const ten = tenants[i];
            if (ten.name.indexOf(query) === 0) {
                _filteredTenant.push(ten);
            }
        }
        setFilteredTenant(_filteredTenant);
    }

    const getTenants = async () => {
        
        const myData = await fetchData(`tenant/byApartment/${tenant?.apartment_id}`);
        if (myData) {
            setTenants(myData);
        }
    }

    useEffect(() => { { getTenants() } }, [])

    const accept = async() => {
        
        const res = await deleteData(`tenant/${id}`);
        if(res == 200 || res == 201){
            toast.current.show({ severity: 'success', detail: 'הדייר/ת נמחק/ה בהצלחה', life: 3000 });
            setSelectedTenant(null);
        }  
        else
            toast.current.show({ severity: 'error', detail: 'לא נתן למחוק את איש הקשר של הדירה או שלא בחרת דייר למחיקה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'הדייר/ת לא נמחקה', life: 3000 });
    };


    return (
        <>
            <div className="flex justify-content-center">
                <Card style={{ width: "30%", margin: "5%" }} title="מחיקת דייר/ת מהדירה שלך " >
                    <div>
                        <small>הערה: את איש הקשר של הדירה שלך אין אפשרות למחוק אלא רק לשנות את פרטיו</small><br/><br/><br/>
                        <div className="flex ">
                            <div className="p-float-label">
                                <AutoComplete
                                    style={{ direction: "ltr" }}
                                    value={selectedTenant}
                                    suggestions={filteredTenant}
                                    completeMethod={searchTenant}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="name"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedTenant(e.value);
                                        setId(e.value.id);
                                    }}
                                />
                                <label htmlFor="activeVote" >*דייר/ת לבחירה</label>
                            </div>
  
                        </div>
                    </div>
                    <br /><br />
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך למחוק את הדייר/ת שבחרת " icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                        <Button
                            ref={buttonEl}
                            onClick={() => {
                                setVisible(true);
                            }}
                            icon="pi pi-user-minus"
                            label="מחיקת הדייר/ת"
                            style={{direction: "ltr"}}
                        />
                </Card>
            </div>
        </>
    )
}