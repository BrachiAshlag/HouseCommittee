import { Card } from 'primereact/card';
import React, { useContext, useEffect, useRef, useState } from "react";
import { deleteData, fetchData } from '../Hooks/useAxiosGet';
import { Button } from 'primereact/button';
import { RadioButton } from 'primereact/radiobutton';
import { AutoComplete } from 'primereact/autocomplete';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import UserContext from './UserContext';


// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function RemoveApartment(props) {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const [apartments, setApartments] = useState(null);

    const toast = useRef(null);
    const buttonEl = useRef(null);
    
    const [id, setId] = useState(null);
    
    const [selectedApartment, setSelectedApartment] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState(null);

    const [visible, setVisible] = useState(false);

    const searchApartment = (event) => {
        
        let query = event.query;
        let _filteredApartments = [];

        for (let i = 0; i < apartments.length; i++) {
            const apartment = apartments[i];
            if (apartment.description.toString().indexOf(query) === 0) {
                _filteredApartments.push(apartment);
            }
        }
        setFilteredApartments(_filteredApartments);
    }

    const getApartments = async (url) => {
        var myData = await fetchData(url);
        if (myData) {
            myData.map(e => e.description = `דירה ${e.apartmentDescription} כניסה ${e.entryDescription}`)
            for (let i = 0; i < myData.length; i++) {
                if(myData[i].id == tenant.apartment_id)
                    myData[i].description = "הדירה שלך"
            }
            setApartments(myData);
        }
    }


    useEffect(() => {
        setSelectedApartment(null);
        getApartments(`apartment/description?building_id=${tenant?.building_id}`);
    }, [])

    const accept = async () => {
        const res = await deleteData(`apartment/byId/${id}`)
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'הדירה נמחקה בהצלחה', life: 3000 });
            setSelectedApartment(null);
        }
        else
            toast.current.show({ severity: 'error', detail: 'לא נבחרה דירה למחיקה', life: 3000 });

    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'הדירה לא נמחקה', life: 3000 });
    };

    return (
        <>
            <div className="flex justify-content-center">
                <Card style={{ width: "30%", margin: "5%" }} title="מחיקת דירה " >
                    <div className="flex ">
                        <div className="p-float-label">
                            <AutoComplete
                                style={{ direction: "ltr" }}
                                value={selectedApartment}
                                suggestions={filteredApartments}
                                completeMethod={searchApartment}
                                virtualScrollerOptions={{ itemSize: 38 }}
                                field="description"
                                dropdown
                                onChange={(e) => {
                                    setSelectedApartment(e.value);
                                    setId(e.value.id);
                                }}
                            />
                            <label htmlFor="apartment" /*className={classNames({ 'p-error': isFormFieldValid(meta) })}*/>*דירה</label>
                        </div>
                    </div>
                    <br /><br />
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך למחוק את הדירה שבחרת" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                        <Button
                            ref={buttonEl}
                            onClick={() => {
                                setVisible(true);
                            }}
                            icon="pi pi-trash"
                            label="מחיקת הדירה"
                            style={{direction: "ltr"}}
                        />
                </Card>
            </div>
        </>
    )
}