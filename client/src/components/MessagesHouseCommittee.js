import React, { useState, useEffect, useRef, useContext } from 'react';
import { Button } from 'primereact/button';
import { DataView } from 'primereact/dataview';
import { deleteData, fetchData } from '../Hooks/useAxiosGet';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Card } from 'primereact/card';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
// const tenant = { building_id: 1 };

export default function MessagesHouseCommittee() {
      // const tenant = useContext(UserContext)?.data;
  const [tenant, setTenant]= useState(JSON.parse(localStorage.getItem("tenant")));
    const navigate = useNavigate();

    const [messages, setMessages] = useState([]);
    const [id, setId] = useState([]);

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const getMessages = async () => {
        const data = await fetchData(`message?building_id=${tenant?.building_id}`);
        setMessages(data);
    }

    const accept = async () => {
        const res = await deleteData(`message/${id}`);
        if (res == 200 || res == 201)
            toast.current.show({ severity: 'success', detail: 'הפנייה הוסרה בהצלחה', life: 3000 });
        else
            toast.current.show({ severity: 'error', detail: 'הפנייה לא הוסרה, ישנם פרטים חסרים', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'הפנייה לא הוסרה', life: 3000 });
    };

    useEffect(() => {
        getMessages();
    }, [visible])

    const gridItem = (message) => {
        return (
            <div className="col-12 sm:col-6 lg:col-12 xl:col-4 p-2">
                <div className="p-4 border-1 surface-border surface-card border-round">
                    <div className="flex flex-wrap align-items-center justify-content-between gap-2">
                        <div className="flex align-items-center gap-2">
                            <i className="pi pi-calendar" style={{ color: "#6366F1" }}></i>
                            <span className="font-semibold">תאריך יצירת הפנייה: {message.creation_date.slice(0, 10)}</span>
                        </div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-2xl font-bold text-900">{message.title}</div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        <div className="text-1.5xl font-bold text-750">{message.subtitle}</div>
                    </div>
                    <div className="flex flex-column align-items-center gap-3 py-5">
                        {message.description? <div className="text-1xl font-solid text-900">{message.description}</div> : <><br/><br/></>}
                    </div>
                    <div className="flex align-items-center justify-content-between">
                        <Toast ref={toast} />
                        <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                            message="האם הנך בטוח/ה שברצונך למחוק את הפנייה שבחרת" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                        <Button icon="pi pi-trash" severity="danger" /*raised*/ rounded outlined aria-label="Cancel" title='מחיקה' style={{ direction: "ltr" }} onClick={e => { setId(message.id); setVisible(true) }} />
                        {message.title == "הצעה להצבעה" &&
                            <Button icon="pi pi-file-edit" outlined label='צור את ההצבעה' style={{ direction: "ltr" }} onClick={e => { navigate(`/addVote`, { state: { subject: message.subtitle } }) }} />
                        }
                        {message.title == "הצעה למודעה לפרסום בלוח המודעות" &&
                            <Button icon="pi pi-file-edit" /*raised*/ outlined label='צור את המודעה' style={{ direction: "ltr" }} onClick={e => { navigate("/addAd", { state: { subject: message.subtitle, description: message.description } }) }} />
                        }
                    </div>
                </div>
            </div>
        );
    };


    return (
        <div className="card flex justify-content-center">
            <Card title="פניות שנשלחו לוועד הבית" style={{ width: "95%" }}>
                <DataView value={messages} itemTemplate={gridItem} />
            </Card>
        </div>
    )
}