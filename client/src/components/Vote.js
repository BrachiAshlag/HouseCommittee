import React, { useContext, useRef, useState } from 'react';
import '../Css/Vote.css'
import { postData } from '../Hooks/useAxiosGet'
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import UserContext from './UserContext';
import { Button } from 'primereact/button';

// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function Vote(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [objToData, setObjToData] = useState({ vote_id: props.allVote.id, tenant_id: tenant.id });

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const accept = async () => {
        const res = await postData(`tenantVote`, objToData);
        if (res == 200 || res == 201)
            toast.current.show({ severity: 'success', detail: 'הצבעתך נשמרה בהצלחה', life: 3000 });
        else
            toast.current.show({ severity: 'error', detail: 'הצבעתך לא נשמרה, ישנם פרטים חסרים', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'הצבעתך לא נשמרה', life: 3000 });
    };

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    return (
        <>
            <div className='flex justify-content-center' style={{ width: "100%" }}>
                <Card title={props.subject} style={{ width: "90%" }} className='flex justify-content-center'>
                    <div>נא ללחוץ על האפשרות הרצויה</div>
                    <div>{`תאריך סיום אפשרות הצבעה ${props.end_date}`}</div><br />
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך לשלוח את הצבעתך? לאחר ההצבעה אין אפשרות להתחרט"
                        icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                    <Button rounded text className="flex-wrap justify-content-center"
                        title={`לחץ כאן כדי להצביע ${props.positive}`}
                        ref={buttonEl}
                        style={{ border: "none", background: "none", cursor: "pointer" }}
                        onClick={() => {
                            handleChange(1, "answer");
                            setVisible(true);
                        }}
                    >
                        <i
                            class="flex align-items-center justify-content-center"
                            id="pos"
                            className="pi pi-fw pi-thumbs-up"
                            style={{ color: '#32CD32', fontSize: '3.5rem', display: "grid" }}
                        ></i>{/*<br/>*/}
                        <div style={{ color: "black", margin: "4.5%", fontSize: "0.9rem", fontWeight: "700" }}>{props.positive}</div>
                    </Button>
                    <Button 
                        rounded
                        text 
                        className="flex-wrap justify-content-center"
                        title={`לחץ כאן כדי להצביע כנמנע`}
                        ref={buttonEl}
                        style={{ border: "none", background: "none", cursor: "pointer" }}
                        onClick={() => {
                            handleChange(0, "answer");
                            setVisible(true);
                        }}>
                        <i
                            class=" flex align-items-center justify-content-center"
                            id="netral"
                            className="pi pi-fw pi-minus-circle"
                            style={{ color: 'grey', fontSize: '3.5rem' }}
                        ></i>
                        <div style={{ color: "black", margin: "4.5%", fontSize: "0.9rem", fontWeight: "700" }}>נמנע</div>
                    </Button>
                    <Button 
                        rounded 
                        text 
                        className="flex-wrap justify-content-center"
                        title={`לחץ כאן כדי להצביע ${props.negative}`}
                        ref={buttonEl}
                        style={{ border: "none", background: "none", cursor: "pointer" }}
                        onClick={() => {
                            handleChange(-1, "answer");
                            setVisible(true);
                        }}>
                        <i
                            class=" flex align-items-center justify-content-center"
                            id="neg"
                            className="pi pi-fw pi-thumbs-down"
                            style={{ color: '#B22222', fontSize: '3.5rem' }}
                        ></i>
                        <div style={{ color: "black", margin: "4.5%", fontSize: "0.9rem", fontWeight: "700" }}>{props.negative}</div>
                    </Button>
                </Card>
            </div>
        </>
    )
}
