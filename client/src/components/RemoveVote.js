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

export default function VotesResultsScreen(props) {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const data = [
        { id: -1, description: "לכל הבניין שלך" },
        { id: -2, description: "רק לכניסה שלך" }
    ]

    const [activeVotes, setActiveVotes] = useState(null);
    const [selectedOption, setSelectedOption] = useState(data[0]);

    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [selectedVote, setSelectedVote] = useState(null);
    const [id, setId] = useState(null);

    const [filteredVotes, setFilteredVotes] = useState(null);

    const [visible, setVisible] = useState(false);

    const searchVote = (event) => {
        let query = event.query;
        let _filteredVotes = [];
        
        for (let i = 0; i < activeVotes.length; i++) {
            const activeVote = activeVotes[i];
            if (activeVote.subject.indexOf(query) === 0) {
                _filteredVotes.push(activeVote);
            }
        }
        setFilteredVotes(_filteredVotes);
    }

    const getVotes = async (url) => {
        
        const votes = await fetchData(url);
        if (votes) {
            setActiveVotes(votes);
        }
    }

    useEffect(() => {
        if (selectedOption.id === -1)
            getVotes(`vote/active?building_id=${tenant?.building_id}`);
        else if (selectedOption.id === -2)
            getVotes(`vote/active?&entry_id=${tenant?.entry_id}`);
    }, [selectedOption])

    const accept = async () => {
        const res = await deleteData(`vote/${id}`);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'ההצבעה נמחקה בהצלחה', life: 3000 });
            setSelectedVote(null);
        }
        else
            toast.current.show({ severity: 'error', detail: 'לא נבחרה הצבעה למחיקה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'ההצבעה לא נמחקה', life: 3000 });
    };


    return (
        <>
            <div className="flex justify-content-center">
                <Card style={{ width: "30%", margin: "5%" }} title="מחיקת הצבעה " >
                    <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>למי שייכת ההצבעה שברצונך למחוק</span>
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
                                    value={selectedVote}
                                    suggestions={filteredVotes}
                                    completeMethod={searchVote}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="subject"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedVote(e.value);
                                        setId(e.value.id);
                                    }}
                                />
                                <label htmlFor="activeVote">*הצבעה</label>
                            </div>

                        </div>
                    </div>
                    <br /><br />
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך למחוק את ההצבעה שנבחרה " icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                        <Button
                            ref={buttonEl}
                            onClick={() => {
                                setVisible(true);
                            }}
                            icon="pi pi-trash"
                            label="מחיקת ההצבעה"
                            style={{direction: "ltr"}}
                        />
                </Card>
            </div>
        </>
    )
}