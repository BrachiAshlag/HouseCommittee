
import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Card } from "primereact/card";
import { putData } from "../Hooks/useAxiosGet";
import { ConfirmPopup } from "primereact/confirmpopup";
import { useNavigate } from 'react-router-dom';


export default function ForgetPassword(props) {
    const [tenantId, setTenantId] = useState(null);
    const [buildingId, setBuildingId] = useState(null);
    const [email, setEmail] = useState(null);
    const navigate = useNavigate();

    const [visible, setVisible] = useState(false);

    const toast = useRef(null);
    const buttonEl = useRef(null);

    const accept = async () => {
        const res = await putData(`forgetPassword?tenant_id=${tenantId}&building_id=${buildingId}&email=${email}`);
        if(res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'סיסמא חדשה נשלחה למייל שלך', life: 3000 });
        }
        else {
            toast.current.show({ severity: 'error', detail: 'ישנם פרטים שגויים או חסרים, נתן לנסות שנית', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: "לא נשלחה סיסמא חדשה", life: 3000 });
    };


    return (<>
        <div className="card flex justify-content-center">
            <Card title="שחזור סיסמא" style={{ width: "50%", margin: "5px" }} className="flex justify-content-center">
                <div className="field" style={{ margin: "22px" }}>
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-building" />
                        <InputText id="buildingId" value={buildingId} onChange={e => setBuildingId(e.target.value)} style={{ direction: "ltr", width: "100%" }} />
                        <label htmlFor="buildingId">*קוד בניין</label>
                    </span>
                </div>
                <div className="field" style={{ margin: "22px" }}>
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-id-card" />
                        <InputText id="tenantId" value={tenantId} onChange={e => setTenantId(e.target.value)} style={{ direction: "ltr", width: "100%" }} />
                        <label htmlFor="tenantId" >*מספר זהות</label>
                    </span>
                </div>
                <div className="field" style={{ margin: "22px" }}>
                    <span className="p-float-label p-input-icon-right">
                        <i className="pi pi-envelope" />
                        <InputText id="email" value={email} onChange={e => setEmail(e.target.value)} style={{ direction: "ltr", width: "100%" }} />
                        <label htmlFor="email">*אימייל</label>
                    </span>
                </div>
                <Toast ref={toast} />
                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                    message="האם הנך בטוח/ה שברצונך לקבל סיסמא חדשה" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                <div className="card flex justify-content-center">
                    <Button type="submit" label="שליחת סיסמא לאימייל" className="mt-2" onClick={() => { setVisible(true) }} style={{ width: "100%", direction: "ltr" }}/*icon="pi pi-envelope" onClick={onSubmit}*/ />
                </div>
                <br />
                <small id="back" className="card flex justify-content-center" onClick={() => props.setForgetPasswordCallback(false)} style={{ cursor: "pointer" }}>          
                    חזרה לכניסה למערכת
                </small>
            </Card>

        </div >
    </>
    )
}

