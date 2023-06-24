import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import '../Css/FormDemo.css';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { postData } from '../Hooks/useAxiosGet';
import UserContext from './UserContext';


// const tenant = { apartment_id: 1 }
export default function AddTenant() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));

    const [objToData, setObjToData] = useState({ apartment_id: tenant?.apartment_id });
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const toast = useRef(null);
    const buttonEl = useRef(null);
    const [visible, setVisible] = useState(false);

    const dataForDrop = ["כן", "לא"];

    const [selectedDrop, setSelectedDrop] = useState(dataForDrop[1]);
    const [selectedDropCom, setSelectedDropCom] = useState(dataForDrop[1]);

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const accept = async () => {
        const res = await postData(`tenant`, objToData);
        if (res == 200 || res == 201) {
            toast.current.show({ severity: 'success', detail: 'הדייר/ת נוצר/ה בהצלחה, סיסמא תשלח לאימייל שהוזן', life: 3000 });
            if (localStorage.getItem("admin")) {
                localStorage.removeItem("admin");
                localStorage.setItem("tenant", JSON.stringify(objToData));
            }
        }
        else {
            toast.current.show({ severity: 'error', detail: 'פרטי הדייר/ת לא נשמרו, ישנם פרטים חסרים', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'פרטי הדייר/ת לא נשמרו', life: 3000 });
    };

    const validate = (data) => {
        let errors = {};
        if (!data.id) {
            errors.id = 'שדה חובה';
        }

        if (!data.name) {
            errors.name = 'שדה חובה';
        }

        if (!data.email) {
            errors.email = 'שדה חובה';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'האימייל שהזנת אינו חוקי';
        }

        if (!data.phone) {
            errors.phone = 'שדה חובה';
        }

        if (!data.date) {
            errors.date = 'שדה חובה';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        // setShowMessage(true);
        setVisible(true);
        // form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    useEffect(() => {
        if (localStorage.getItem("admin")) {
            handleChange(true, "is_building_committee")
        }
        else {
            handleChange(false, "is_building_committee")
        }
    }, [])

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>הדייר נוסף בהצלחה</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        הדייר <b>{formData.name}</b> נוסף בהצלחה למערכת, סיסמת הדייר שנוסף נשלחה ל<b>{formData.email}</b>.
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="הוספת דייר">
                        <Form onSubmit={onSubmit} initialValues={{ id: "", name: "", email: "", phone: "", date: "", car: "" }} /*validate={validate}*/ render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid">
                                <Field name="id" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputMask id="id" /*{...input}*/ mask='999999999' onChange={e => handleChange(e.target.value, "id")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} style={{ direction: "ltr" }} />
                                            <label htmlFor="id" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר זהות</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="name" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="name" onChange={e => handleChange(e.target.value, "name")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*שם מלא</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="email" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="email" onChange={e => handleChange(e.target.value, "email")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} style={{ direction: "ltr" }} />
                                            <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*אימייל</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="phone" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputMask id="phone" unmask={true} onChange={e => handleChange(e.target.value, "phone")} mask="999-999-9999" className={classNames({ 'p-invalid': isFormFieldValid(meta) })} style={{ direction: "ltr" }} />
                                            <label htmlFor="phone" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*טלפון נייד</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="date" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Calendar id="date" /*{...input}*/ onChange={e => handleChange(e.target.value, "birth_date")} dateFormat="dd/mm/yy" showIcon className={classNames({ 'p-invalid': isFormFieldValid(meta) })} style={{ direction: "ltr" }} />
                                            <label htmlFor="date" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תאריך לידה</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="car" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="car" onChange={e => handleChange(e.target.value, "car_id")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="car" className={classNames({ 'p-error': isFormFieldValid(meta) })}>מספר רכב</label>
                                        </span>
                                    </div>
                                )} />
                                <Field name="parking_premit" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Dropdown
                                                id="parking_premit"
                                                value={selectedDrop}
                                                onChange={(e) => {
                                                    setSelectedDrop(e.target.value);
                                                    switch (e.target.value) {
                                                        case "כן":
                                                            handleChange(true, "parking_premit");
                                                            break;
                                                        case "לא":
                                                            handleChange(false, "parking_premit");
                                                            break;
                                                    }
                                                }
                                                }
                                                options={dataForDrop}
                                                className="w-full md:w-14rem"
                                                style={{ minWidth: "100%", autoWidth: "false", width: "100% !important", direction: "ltr" }}
                                            />
                                            <label htmlFor="parking_premit" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*האם רשאי לפתוח את החניון</label>
                                        </span>
                                    </div>
                                )} />
                                {tenant?.is_building_committee && !localStorage.getItem("admin") &&
                                    <Field name="is_building_committee" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <Dropdown
                                                    id="is_building_committee"
                                                    value={selectedDropCom}
                                                    onChange={(e) => {
                                                        setSelectedDropCom(e.target.value);
                                                        switch (e.target.value) {
                                                            case "כן":
                                                                handleChange(true, "is_building_committee");
                                                                break;
                                                            case "לא":
                                                                handleChange(false, "is_building_committee");
                                                                break;
                                                        }
                                                    }
                                                    }
                                                    options={dataForDrop}
                                                    className="w-full md:w-14rem"
                                                    style={{ minWidth: "100%", autoWidth: "false", width: "100% !important", direction: "ltr" }}
                                                />
                                                <label htmlFor="is_building_committee" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*האם הדייר הינו וועד הבית</label>
                                            </span>
                                        </div>
                                    )} />}
                                <Toast ref={toast} />
                                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                    message="האם הנך בטוח/ה שברצונך להוסיף דייר/ת חדש/ה לדירה שלך" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                                <div className="card flex justify-content-center">
                                    <Button type="submit" label="הוספת הדייר" className="mt-2" icon="pi pi-user-plus" style={{ direction: "ltr" }} />
                                </div>
                            </form>
                        )} />
                    </Card>
                </div>
            </div>
        </div>
    );
}