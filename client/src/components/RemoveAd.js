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

export default function RemoveAd(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const data = [
        { id: -1, description: "לכל הבניין שלך" },
        { id: -2, description: "רק לכניסה שלך" }
    ]

    const [activeAds, setActiveAds] = useState(null);
    const [selectedOption, setSelectedOption] = useState(data[0]);

    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [selectedAd, setSelectedAd] = useState(null);
    const [id, setId] = useState(null);

    const [filteredAds, setFilteredAds] = useState(null);

    const [visible, setVisible] = useState(false);

    const searchAd = (event) => {
        let query = event.query;
        let _filteredAds = [];

        for (let i = 0; i < activeAds.length; i++) {
            const activeAd = activeAds[i];
            if (activeAd.subject.indexOf(query) === 0) {
                _filteredAds.push(activeAd);
            }
        }
        setFilteredAds(_filteredAds);
    }

    const getAds = async (url) => {

        const ads = await fetchData(url);
        if (ads)
            setActiveAds(ads);
    }


    useEffect(() => {
        setSelectedAd(null);
        if (selectedOption.id === -1)
            getAds(`adsBoard?building_id=${tenant?.building_id}`);
        else if (selectedOption.id === -2)
            getAds(`adsBoard?&entry_id=${tenant?.entry_id}`);
    }, [selectedOption, visible])

    const accept = async () => {
        const res = await deleteData(`adsBoard/${id}`)
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'המודעה נמחקה בהצלחה', life: 3000 });
            setSelectedAd(null);
        }
        else
            toast.current.show({ severity: 'error', detail: 'לא נבחרה מודעה למחיקה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'המודעה לא נמחקה', life: 3000 });
    };

    return (
        <>
            <div className="flex justify-content-center">
                <Card style={{ width: "40%" }} title="מחיקת מודעה" >
                    <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>למי שייכת המודעה שברצונך למחוק</span>
                    <div style={{ padding: "3%" }}>
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
                                            }}
                                            checked={selectedOption.id === option.id}
                                        />
                                        <label htmlFor={option.id} className="ml-2">{`${option.description}`}</label>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                    <br />
                    <div>
                        <div className="flex ">
                            <div className="p-float-label">
                                <AutoComplete
                                    style={{ direction: "ltr" }}
                                    value={selectedAd}
                                    suggestions={filteredAds}
                                    completeMethod={searchAd}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="subject"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedAd(e.value);
                                        setId(e.value.id);
                                    }}
                                />
                                <label htmlFor="activeAd" /*className={classNames({ 'p-error': isFormFieldValid(meta) })}*/>*מודעה</label>
                            </div>

                        </div>
                    </div>
                    <br /><br />
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך למחוק את המודעה שבחרת" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                    <Button
                        ref={buttonEl}
                        onClick={() => {
                            setVisible(true);
                        }}
                        icon="pi pi-trash"
                        label="מחיקת המודעה"
                        style={{ direction: "ltr" }}
                    />
                </Card>
            </div>
        </>
    )
}