import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import '../Css/FormDemo.css';


export default function AddTenant() {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const validate = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = 'שם נדרש';
        }

        if (!data.email) {
            errors.email = 'אימייל נדרש';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "כתובת אימייל לא תקינה הפורמט הנדרש הוא example@email.com";
        }

        if (!data.phone) {
            errors.phone = 'טלפון נייד נדרש';
        }

        if (!data.date) {
            errors.date = 'תאריך לידה נדרש';
        }

        return errors;
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        setShowMessage(true);

        form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };



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
                        {/* <h5 className="text-center">הוספת דייר</h5> */}
                        <Form onSubmit={onSubmit} initialValues={{ name: '', email: '', phone: '', date: null, car: '' }} validate={validate} render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid">
                                <Field name="name" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="name" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="name" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*שם מלא</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="email" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label p-input-icon-right">
                                            <i className="pi pi-envelope" />
                                            <InputText id="email" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*אימייל</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="phone" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label p-input-icon-right">
                                            <i className="pi pi-mobile" />
                                            <InputMask id="phone" unmask={true} {...input} mask="999-999-9999" className={classNames({ 'p-invalid': isFormFieldValid(meta) }) } style={{ direction: "ltr" }} />
                                            <label htmlFor="phone" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*טלפון נייד</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="date" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <Calendar id="date" {...input} dateFormat="dd/mm/yy" mask="99/99/9999" showIcon style={{ direction: "ltr" }} />
                                            <label htmlFor="date">*תאריך לידה</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="car" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="car" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="car" className={classNames({ 'p-error': isFormFieldValid(meta) })}>מספר רכב</label>
                                        </span>
                                    </div>
                                )} />
                                <Button type="submit" label="הוספת הדייר" className="mt-2" icon="pi pi-user"/>
                            </form>
                        )} />
                    </Card>
                </div>
            </div>
        </div>
    );
}