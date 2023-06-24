import React, { useContext, useRef, useState } from "react";
import { Password } from 'primereact/password';
import { Card } from "primereact/card";
import { Divider } from 'primereact/divider';
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ConfirmPopup } from "primereact/confirmpopup";
import { putData } from "../Hooks/useAxiosGet";
import UserContext from "./UserContext";

// const tenant = { id: 213843360 };

export default function ChangePassword() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [value1, setValue1] = useState('');
    const [value2, setValue2] = useState('');
    const [visible, setVisible] = useState(false);

    const toast = useRef(null);
    const buttonEl = useRef(null);

    const accept = async () => {
        const res = await putData(`tenant/changePassword/${tenant?.id}?oldPassword=${value1}&newPassword=${value2}`);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'סיסמתך שונתה בהצלחה', life: 3000 });
        }
        else {
            toast.current.show({ severity: 'error', detail: 'הסיסמא לא נשמרה, ישנם פרטים חסרים', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'סיסמתך לא השתנתה', life: 3000 });
    };

    const header = <div className="font-bold mb-3">נא להזין סיסמא חדשה</div>;
    const footer = (
        <>
            <Divider />
            <p className="mt-2" style={{ direction: "rtl" }}>הצעות</p>
            <ul className="pl-2 ml-2 mt-0 line-height-3" style={{ direction: "rtl" }}>
                <li>באנגלית</li>
                <li>לפחות אות אחת קטנה</li>
                <li>לפחות אות אחת גדולה</li>
                <li>לפחות ספרה אחת</li>
                <li>מינימום 8 תווים</li>
            </ul>
        </>
    );
    return <>

        <div className="flex justify-content-center">
            <div className="card">
                <Card title="שינוי סיסמא">
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <Password inputId="password" value={value1} onChange={(e) => setValue1(e.target.value)} feedback={false} toggleMask />
                            <label htmlFor="password">סיסמא ישנה</label>
                        </span>
                    </div>
                    <br />
                    <div className="card flex justify-content-center">
                        <span className="p-float-label">
                            <Password
                                inputId="password"
                                value={value2}
                                onChange={(e) => setValue2(e.target.value)}
                                toggleMask
                                header={header}
                                footer={footer}
                                promptLabel="יש לבחור סיסמא"
                                weakLabel="חלשה" mediumLabel="בינונית" strongLabel="חזקה"
                            />
                            <label htmlFor="password">סיסמא חדשה</label>
                        </span>
                    </div>
                    <br />
                    <Toast ref={toast} />
                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                        message="האם הנך בטוח/ה שברצונך לשנות את סיסמתך" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                    <div className="card flex justify-content-center">
                        <Button ref={buttonEl} onClick={() => setVisible(true)} icon="pi pi-check-circle" label="שינוי הסיסמא" style={{ direction: "ltr", width: "100%" }}></Button>
                    </div>

                </Card>
            </div>
        </div>
    </>
}