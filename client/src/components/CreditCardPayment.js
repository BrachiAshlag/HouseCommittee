import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { InputMask } from 'primereact/inputmask';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';

import { fetchData, postData } from '../Hooks/useAxiosGet';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import UserContext from './UserContext';

// const tenant = { building_id: 1, apartment_id:1 }

export default function CreditCardPayment() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [objToData, setObjToData] = useState({ payments_date: new Date(), apartment_id: tenant.apartment_id });
    const [data, setData] = useState([])

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const [selectedItem, setSelectedItem] = useState(null);
    const [filteredItems, setFilteredItems] = useState(null);

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const getMonth = async () => {
        const myData = await fetchData(`month?building_id=${tenant?.building_id}`);
        setData(myData);
    }

    const getPaymentForm = async () => {
        const myData = await fetchData(`paymentForm?building_id=${tenant?.building_id}`);
        if (myData) {
            for (let i = 0; i < myData.length; i++) {
                const element = myData[i];
                if (element.description == "אשראי") {
                    handleChange(element.id, "payment_form_id")
                }
            }
        }
    }

    useEffect(() => {
        getMonth();
        getPaymentForm();
    }, [])

    const accept = async () => {
        const res = await postData(`tenantPayment`, objToData);
        if (res == 200 || res == 201)
            toast.current.show({ severity: 'success', detail: 'התשלום בוצע בהצלחה', life: 3000 });
        else
            toast.current.show({ severity: 'error', detail: "התשלום לא בוצע, ישנם פרטים חסרים", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'התשלום לא בוצע', life: 3000 });
    };

    const searchItems = (event) => {
        if (data?.length) {
            let query = event.query;
            let _filteredItems = [];

            for (let i = 0; i < data.length; i++) {
                const month = data[i];
                if (month.month.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                    _filteredItems.push(month);
                }
            }
            setFilteredItems(_filteredItems);
        }
    }

    const validate = (data) => {
        let errors = {};

        if (!data.month || !data.amount || !data.id || !data.cardNum || !data.validity || !data.back || !data.payNum) {
            errors.data = 'כל השדות נדרשים';
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
                    <h5>התשלום בוצע בהצלחה</h5>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="תשלום באשראי">
                        <Form onSubmit={onSubmit} initialValues={{ month: "", amount: "", id: "", cardNum: "", validity: "", back: "", payNum: "" }} validate={validate} render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid" style={{ direction: "ltr" }}>
                                <Field name="month" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <AutoComplete
                                                value={selectedItem}
                                                suggestions={filteredItems}
                                                completeMethod={searchItems}
                                                virtualScrollerOptions={{ itemSize: 38 }}
                                                field="month"
                                                dropdown
                                                onChange={(e) => {
                                                    setSelectedItem(e.value);

                                                    handleChange(e.value.id, "month");
                                                }}
                                            />
                                            <label htmlFor="month" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תשלום עבור חודש</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="amount" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText
                                                id="amount"
                                                className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                onChange={e => {
                                                    handleChange(e.target.value, "amount")
                                                }}
                                            />
                                            <label htmlFor="amount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*סכום</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="id" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputMask id="id" /*{...input}*/ mask='999999999' className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="id" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר זהות בעל הכרטיס</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="cardNum" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputMask id="cardNum" /*autoClear={false}*/ /*{...input}*/ mask="9999-9999-9999-9999" className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="cardNum" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר אשראי</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="validity" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputMask id="validity" /*{...input}*/ mask="99/99" className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="validity" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תוקף</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="back" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputMask id="back" /*{...input}*/ mask="999" /*autoClear={false}*/ className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="back" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*שלוש ספרות בגב הכרטיס</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="payNum" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="payNum" /*{...input}*/ onChange={e => handleChange(parseInt(e.target.value), "num_of_payments")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="payNum" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר תשלומים</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Toast ref={toast} />
                                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                    message="האם הנך בטוח/ה שברצונך לאשר את התשלום" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                                <div className="card flex justify-content-center">
                                    <Button
                                        ref={buttonEl}
                                        onClick={() => {
                                            setVisible(true);
                                        }}
                                        icon="pi pi-credit-card"
                                        label="ביצוע התשלום"
                                        style={{ direction: "ltr" }}
                                    />
                                </div>
                            </form>
                        )} />
                    </Card>
                </div>
            </div>
        </div>
    );
}