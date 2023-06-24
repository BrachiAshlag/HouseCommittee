import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { Calendar } from 'primereact/calendar';
import { fetchData, postData } from '../Hooks/useAxiosGet';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import UserContext from './UserContext';
// const tenant = { id: 1, apartment_id: 1, entry_id: 1, building_id: 1 }

export default function Cash() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const [objToData, setObjToData] = useState({
        num_of_payments: 1,
        payments_date: new Date()
    });

    const [selectedMonth, setSelectedMonth] = useState(null);
    const [filteredMonthes, setFilteredMonthes] = useState(null);

    const [selectedApartment, setSelectedApartment] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState(null);

    const [date, setDate] = useState(null);
    const [value2, setValue2] = useState(null);

    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const [monthes, setMonthes] = useState([]);
    const [apartments, setApartments] = useState([]);

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

    const getMonthes = async (url) => {
        const myData = await fetchData(url);
        setMonthes(myData);
    }

    const getApartments = async (url) => {
        var myData = await fetchData(url);
        if (myData) {
            myData.map(e => e.description = `דירה ${e.apartmentDescription} כניסה ${e.entryDescription}`)
            for (let i = 0; i < myData.length; i++) {
                if (myData[i].id == tenant.apartment_id)
                    myData[i].description = "הדירה שלך"
            }
            setApartments(myData);
        }
    }

    const getPaymentForm = async () => {
        const myData = await fetchData(`paymentForm?building_id=${tenant?.building_id}`);

        if (myData) {
            for (let i = 0; i < myData.length; i++) {
                const element = myData[i];
                if (element.description == "מזומן") {
                    handleChange(element.id, "payment_form_id")
                }
            }
        }
    }

    useEffect(() => {
        getMonthes(`month?building_id=${tenant?.building_id}`);
        getApartments(`apartment/description?building_id=${tenant?.building_id}`);
        getPaymentForm();
    }, [])

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }))
    }

    const searchMonthes = (event) => {
        if (monthes?.length) {
            let query = event.query;
            let _filteredMonthes = [];

            for (let i = 0; i < monthes.length; i++) {
                const month = monthes[i];
                if (month.month.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                    _filteredMonthes.push(month);
                }
            }
            setFilteredMonthes(_filteredMonthes);
        }

    }

    const searchApartment = (event) => {
        let query = event.query;
        let _filteredApartmens = [];

        for (let i = 0; i < apartments.length; i++) {
            const apartment = apartments[i];
            if (apartment.description.indexOf(query) === 0) {
                _filteredApartmens.push(apartment);
            }
        }
        setFilteredApartments(_filteredApartmens);
    }

    const validate = (data) => {
        debugger;
        let errors = {};
        console.log({ data });
        if (!data.month)
            errors.month = 'שדה חובה';
        if (!data.amount)
            errors.amount = 'שדה חובה';
        if (!data.date)
            errors.date = 'שדה חובה';
        if (!data.apartment)
            errors.apartment = 'שדה חובה';

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
        <>
            <div className="form-demo">
                <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                    <div className="flex align-items-center flex-column pt-6 px-3">
                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                        <h5>התשלום בוצע בהצלחה</h5>
                    </div>
                </Dialog>

                <div className="flex justify-content-center">
                    <div className="card">
                        <Card title="עדכון על תשלום במזומן">
                            <Form onSubmit={onSubmit} initialValues={{ apartment: "", month: "", amount: "", date: "" }} validate={validate} render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit} className="p-fluid" style={{ direction: "ltr" }}>
                                    <Field name="apartment" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <AutoComplete
                                                    value={selectedApartment}
                                                    suggestions={filteredApartments}
                                                    completeMethod={searchApartment}
                                                    virtualScrollerOptions={{ itemSize: 38 }}
                                                    field="description"
                                                    dropdown
                                                    onChange={(e) => {
                                                        setSelectedApartment(e.value)
                                                        handleChange(e.value.id, "apartment_id")
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                />
                                                <label htmlFor="apartment" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*דירה</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="month" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <AutoComplete
                                                    value={selectedMonth}
                                                    suggestions={filteredMonthes}
                                                    completeMethod={searchMonthes}
                                                    virtualScrollerOptions={{ itemSize: 38 }}
                                                    field="month"
                                                    dropdown
                                                    onChange={(e) => {
                                                        setSelectedMonth(e.value);
                                                        handleChange(e.value.id, "month")
                                                    }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                />
                                                <label htmlFor="month" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תשלום עבור חודש</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="amount" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    inputId="withoutgrouping"
                                                    value={value2}
                                                    onValueChange={(e) => {
                                                        setValue2(e.value);
                                                        handleChange(e.target.value, "amount")
                                                    }}
                                                    useGrouping={false}
                                                    minFractionDigits={1}
                                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                />
                                                <label htmlFor="amount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*סכום</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="date" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <Calendar
                                                    value={date}
                                                    onChange={(e) => {
                                                        setDate(e.value);
                                                        handleChange(e.value, "payments_date");
                                                    }}
                                                    dateFormat="dd/mm/yy"
                                                    showIcon
                                                    style={{ direction: "ltr" }}
                                                    className={classNames({ 'p-invalid': isFormFieldValid(meta) })}
                                                />
                                                <label htmlFor="amount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תאריך תשלום</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Toast ref={toast} />
                                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                        message="האם הנך בטוח/ה שברצונך לאשר את התשלום" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                                    <Button
                                        ref={buttonEl}
                                        type="submit"
                                        label="ביצוע התשלום"
                                        className="mt-2"
                                        icon="pi pi-check-circle"
                                        onClick={() => { setVisible(true) }}
                                        style={{ direction: "ltr" }}
                                    />

                                </form>
                            )} />
                        </Card>
                    </div>
                </div>
            </div>
        </>
    );
}
