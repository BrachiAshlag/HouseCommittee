import React, { useEffect, useState } from 'react';
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
const tenant = { id:1, apartment_id:1, entry_id:1, building_id:1 }

export default function Cash() {
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const [objToData, setObjToData] = useState({ 
        num_of_payments:1,
        Approval_from_credit_company: null,
        payments_date: new Date().toISOString().slice(0, 10),
        receipt: null
    });
    
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [filteredMonthes, setFilteredMonthes] = useState(null);

    const [selectedApartment, setSelectedApartment] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState(null);

    const [date, setDate] = useState(null);
    const [value2, setValue2] = useState(0.0);

    const [monthes, setMonthes] = useState([]);
    const [apartments, setApartments] = useState([]);

    const getMonthes = async (url) => {
        const myData = await fetchData(url);
        console.log(myData);
        setMonthes(myData);
    }

    const getApartments = async (url) => {
        var myData = await fetchData(url);
        myData.map(e=> e.description= `דירה ${e.apartmentDescription} כניסה ${e.entryDescription}`)
        console.log(myData);
        setApartments(myData);
    }

    useEffect(() => {
        getMonthes(`month?building_id=${tenant.building_id}`);
        getApartments(`apartment/description?building_id=${tenant.building_id}`);
    }, [])

    const handleChange = (selected, key) => {
        setObjToData((prev)=> ({...prev, [key]: selected}))
    }

    const searchMonthes = (event) => {
        if(monthes?.length){
            let query = event.query;
            let _filteredMonthes = [];

            for(let i = 0; i < monthes.length; i++) {
                const month = monthes[i];
                if (month.month.toLowerCase().indexOf(query.toLowerCase()) === 0) {
                    _filteredMonthes.push(month);
                }
            }
            console.log(_filteredMonthes);
            setFilteredMonthes(_filteredMonthes);
        }
       
    }

    const searchApartment = (event) => {
        let query = event.query;
        let _filteredApartmens = [];

        for(let i = 0; i < apartments.length; i++) {
            const apartment = apartments[i];
            if (apartment.description.indexOf(query) === 0) {
                _filteredApartmens.push(apartment);
            }
        }
        console.log(_filteredApartmens);
        setFilteredApartments(_filteredApartmens);
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
                        <Form onSubmit={onSubmit} initialValues={{ apartment: "", month: "", amount: "", date: ""}} validate={validate} render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid" style={{ direction: "ltr"}}>
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
                                                }}/>
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
                                                minFractionDigits={2}
                                            />
                                            {/* <InputText id="amount" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} /> */}
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
                                                setDate(e.value.toISOString().slice(0, 10));
                                                handleChange(e.value, "payments_date");            
                                            }}
                                            showIcon 
                                            style={{direction: "ltr"}}/>
                                        <label htmlFor="amount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תאריך תשלום</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Button type="submit" label="ביצוע התשלום" className="mt-2" icon = "pi pi-credit-card" onClick={ postData(`tenantPayment`, objToData) }/>
                            </form>
                        )} />
                    </Card>
                </div>
            </div>
        </div>
        </>
    );
}
