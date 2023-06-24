import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { useState } from "react"
import { Form, Field } from "react-final-form";
import { Password } from 'primereact/password';
import { UseSignIn } from "../Hooks/UseGetReturnAll";
import { useNavigate } from 'react-router-dom';
import { Card } from "primereact/card";
import axios from "axios";
import ForgetPassword from "./ForgetPassword";

const SignIn = ({ setTenantIdFunc }) => {
    const [tenantType, setTenantType] = useState("");
    const [forgetPassword, setForgetPassword] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [tenantId, setTenantId] = useState("");
    const [message, setMessage] = useState(<></>);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState(<></>);
    const [formData, setFormData] = useState({});

    const setForgetPasswordCallback = (toset) => {
        setForgetPassword(toset);
    }

    const validate = (data) => {
        let errors = {};
        if (!/*data.*/tenantId) {
            errors.tenantId = 'מספר זהות נדרש';
        }
        else if (/*data.*/tenantId.length != 9 || !/^\d+$/.test(/*data.*/tenantId)) {
            errors.tenantId = 'מספר זהות לא תקין'
        }
        if (!data.password) {
            errors.password = 'סיסמא נדרשת'
        }
        else if (data.password.length < 8 || data.password.length > 12) {
            errors.password = 'הסיסמא שהקשת לא תקינה'
        }
        return errors;
    };

    const onSubmit = async (data, form) => {
        setFormData(data);
        setShowMessage(true);
        setShowErrorMessage(false);
        await HandleClick(data);
        form.restart();
    }

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const navigate = useNavigate();
    const dialogFooterTenant = <div className="flex justify-content-center">
        <Button label="OK" className="p-button-text" autoFocus onClick={async () => {
            setShowErrorMessage(false);
            setShowMessage(false);
            if (tenantId) {
                await axios.get(`http://localhost:8000/tenant/allTenant/${tenantId}`)
                    .then(tenant => {
                        tenant && localStorage.setItem("tenant", JSON.stringify(tenant.data))
                    });
            }
            setTenantIdFunc(tenantId);
            navigate("/home");
        }} />
    </div>;
    const dialogFooterAdmin = <div className="flex justify-content-center">
        <Button label="OK" className="p-button-text" autoFocus onClick={async () => {
            setShowErrorMessage(false);
            setShowMessage(false);
            if (tenantId) {
                await axios.get(`http://localhost:8000/admin/${tenantId}`)
                    .then(tenant => {
                        tenant && localStorage.setItem("admin", JSON.stringify(tenant.data))
                    });
            }
            // 
            setTenantIdFunc(tenantId);
            navigate("/createBuilding");
        }} />
    </div>;
    async function HandleClick(data) {
        const obj = {
            tenantId: tenantId,
            buildingId: data.buildingId,
            password: data.password
        }
        var res;
        try {
            localStorage.clear();
            if (!data.buildingId) { // admin
                res = await UseSignIn(`adminLogin?tenant_id=${tenantId}&password=${data.password}`);
                if (res.status && (res.status === 200 || res.status === 201)) {
                    setTenantType("admin");
                    setMessage(<>
                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                        <h5>נכנסת בהצלחה כמנהל מערכת</h5>
                    </>)
                }
                else if (res.status && res.status === 401) {
                    setShowErrorMessage(true);
                    setErrorMessage(<>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            <i className="pi pi-undo" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                            <h3>הפרטים שהזנת שגויים</h3>
                            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                {res.response.data.message}, נתן לנסות שוב
                            </p>
                            <Button label="נסה שוב" className="p-button-text" autoFocus onClick={() => { setShowErrorMessage(false); setShowMessage(false); navigate("/") }} />
                        </div>
                    </>)
                }
                else {
                    setShowErrorMessage(true);
                    setErrorMessage(<>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            <i className="pi pi-undo" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                            <h3>כניסתך למערכת נכשלה</h3>
                            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                יש לנסות שנית מאוחר יותר
                            </p>
                            <Button label="נסה שוב" className="p-button-text" autoFocus style={{ direction: "ltr" }} onClick={() => { setShowErrorMessage(false); setShowMessage(false); navigate("/") }} />
                        </div>
                    </>)
                }
            }
            else { // tenant
                res = await UseSignIn(`tenantLogin?tenant_id=${tenantId}&password=${data.password}&building_id=${data.buildingId}`);
                if (res.status && (res.status === 200 || res.status === 201)) {
                    setTenantType("tenant");
                    setMessage(<>
                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                        <h5>נכנסת בהצלחה</h5>
                    </>)
                }
                else if (res.response.status && res.response.status === 401) {
                    setShowErrorMessage(true);
                    setErrorMessage(<>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            <i className="pi pi-undo" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                            <h3>הפרטים שהזנת שגויים</h3>
                            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                נתן לנסות שנית
                            </p>
                            <Button label="נסה שוב" className="p-button-text" autoFocus onClick={() => { setShowErrorMessage(false); setShowMessage(false); navigate("/") }} />
                        </div>
                    </>)
                }

                else if (res.response.status && res.response.status === 400) {
                    setShowErrorMessage(true);
                    setErrorMessage(<>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            <i className="pi pi-undo" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                            <h3>הפרטים שהזנת שגויים</h3>
                            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                {res.response.data.message}, נתן לנסות שוב
                            </p>
                            <Button label="נסה שוב" className="p-button-text" autoFocus onClick={() => { setShowErrorMessage(false); setShowMessage(false); navigate("/") }} />
                        </div>
                    </>)
                }
                else {
                    setShowErrorMessage(true);
                    setErrorMessage(<>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            <i className="pi pi-undo" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                            <h3>כניסתך למערכת נכשלה</h3>
                            <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                                יש לנסות שנית מאוחר יותר
                            </p>
                            <Button label="נסה שוב" className="p-button-text" autoFocus style={{ direction: "ltr" }} onClick={() => { setShowErrorMessage(false); setShowMessage(false); navigate("/") }} />
                        </div>
                    </>)
                }
            }
        } catch (error) {
            console.log(error);
        }
    }
    return (
        <>
            {!forgetPassword ? <div className="form-demo">
                {showMessage &&
                    <Dialog visible={showMessage && !showErrorMessage} onHide={() => setShowMessage(false)} position='top' footer={tenantType == "tenant" ? dialogFooterTenant : dialogFooterAdmin} showHeader={false} style={{ width: '30vw' }}>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            {message}
                        </div>
                    </Dialog>}
                {showErrorMessage &&
                    <Dialog visible={showErrorMessage} onHide={() => setShowErrorMessage(false)} position='top' /*footer={errorDialogFooter}*/ showHeader={false} style={{ width: '30vw' }}>
                        <div className="flex align-items-center flex-column pt-6 px-3">
                            {errorMessage}
                        </div>
                    </Dialog>}
                <div className="flex justify-content-center">
                    <div className="card">
                        <Card>
                            <h4 className="text-center">כניסה למערכת</h4>
                            <Form onSubmit={onSubmit} initialValues={{ tenantId: '', password: '' }} validate={validate} render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit} className='p-fluid'>
                                    <Field name="buildingId" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputText id='buildingId' {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                <label htmlFor="buildingId" className={classNames({ 'p-error': isFormFieldValid(meta) })}>קוד בניין*</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                    />
                                    <Field name="tenantId" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputText id='tenantId' {...input} value={tenantId} onChange={e => setTenantId(e.target.value)} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                <label htmlFor="tenantId" className={classNames({ 'p-error': isFormFieldValid(meta) })}>מספר זהות*</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                    />
                                    <Field name="password" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <Password id="password" {...input} feedback={false} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                                <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>סיסמא*</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Button type="submit" label="כניסה למערכת" className="mt-2" icon="pi pi-user" style={{ direction: "ltr" }} />
                                </form>
                            )} />
                            <br />
                            <small id="forget" className="card flex justify-content-center" onClick={() => setForgetPassword(true)} style={{ cursor: "pointer" }}>
                                שכחתי סיסמא
                            </small>
                        </Card>
                    </div>
                </div>
            </div> : <ForgetPassword setForgetPasswordCallback={setForgetPasswordCallback} />}
        </>
    )
}

export default SignIn