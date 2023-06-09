import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { AutoComplete } from "primereact/autocomplete";
import '../Css/FormDemo.css';
import { Calendar } from 'primereact/calendar';
import { InputNumber } from 'primereact/inputnumber';
import { fetchData, postData } from '../Hooks/useAxiosGet';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import UserContext from './UserContext';

// const tenant = { id: 213843360, apartment_id: 1, entry_id: 1, building_id: 1 }

const CreateExpense = () => {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const defaultValues = { value: '' };
    const toast = useRef(null);
    const buttonEl = useRef(null);
    const [visible, setVisible] = useState(false);

    const [objToData, setObjToData] = useState({ building_id: tenant.building_id, receipe: null, permanent: true });

    const [selectedItem, setSelectedItem] = useState(null);
    const [filteredItems, setFilteredItems] = useState(null);

    const [selectedDropPay, setSelectedDropPay] = useState(null);
    const [filteredDropPays, setFilteredDropPays] = useState(null);

    const [value1, setValue1] = useState(0.0);
    const [value2, setValue2] = useState(1);

    const [items, setItems] = useState([]);
    const [paymentTypes, setpaymentTypes] = useState([]);
    const [date, setDate] = useState(null);

    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const permanent = [
        { id: -1, des: "הוצאה קבועה" },
        { id: -2, des: "הוצאה חד פעמית" }
    ]

    const getpaymentTypes = async (url) => {
        const myData = await fetchData(url);
        setpaymentTypes(myData);
    }

    const getExpensesTypes = async (url) => {
        const myData = await fetchData(url);
        setItems(myData);
    }

    const accept = async () => {
        const res = await postData(`expense`, objToData);
        if (res == 200 || res == 201)
            toast.current.show({ severity: 'success', detail: 'ההוצאה נוספה בהצלחה', life: 3000 });
        else
            toast.current.show({ severity: 'error', detail: 'ההוצאה לא נוספה, ישנם פרטים חסרים', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'ההוצאה לא נוספה', life: 3000 });
    };

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    useEffect(() => {
        getExpensesTypes(`expensesKind?building_id=${tenant?.building_id}`);
        getpaymentTypes(`paymentForm?building_id=${tenant?.building_id}`);
    }, [])


    const searchItems = (event) => {
        if (items?.length) {
            let query = event.query;
            let _filteredItems = [];

            for (let i = 0; i < items?.length; i++) {
                let item = items[i];
                if (item.description.indexOf(query) === 0) {
                    _filteredItems.push(item);
                }
            }
            setFilteredItems(_filteredItems);
        }
    }

    const validate = (data) => {
        let errors = {};

        if (!data.date || !data.type || !data.amount || !data.paymentForm || !data.numOfPayments) {
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
                        <h5>הוצאה נרשמה בהצלחה</h5>
                    </div>
                </Dialog>

                <div className="flex justify-content-center">
                    <div className="card">
                        <Card title="עדכון הוצאה חדשה">
                            <Form onSubmit={onSubmit} initialValues={{ date: "", type: "", amount: "", paymentForm: "", numOfPayments: "" }} validate={validate} render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit} className="p-fluid" style={{ direction: "ltr" }}>
                                    <Field name="date" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <Calendar
                                                    value={date}
                                                    onChange={(e) => {
                                                        setDate(e.value);
                                                        handleChange(e.value, "expense_date");
                                                    }}
                                                    dateFormat="dd/mm/yy"
                                                    showIcon
                                                    style={{ "direction": "ltr" }}
                                                />
                                                <label htmlFor="date" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*תאריך</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="type" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <AutoComplete
                                                    value={selectedItem}
                                                    suggestions={filteredItems}
                                                    completeMethod={searchItems}
                                                    virtualScrollerOptions={{ itemSize: 38 }}
                                                    field="description"
                                                    dropdown
                                                    onChange={(e) => {
                                                        setSelectedItem(e.value);
                                                        if (e.value.id)
                                                            handleChange(e.value.id, "expense_type_id");
                                                        else {
                                                            handleChange(null, "expense_type_id");
                                                            handleChange(e.value, "description")
                                                        }
                                                    }} />
                                                <label htmlFor="type" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*סוג הוצאה</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="amount" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    inputId="withoutgrouping"
                                                    value={value1}
                                                    onValueChange={(e) => {
                                                        setValue1(e.value);
                                                        handleChange(e.value, "amount");
                                                    }}
                                                    useGrouping={false}
                                                    minFractionDigits={2}
                                                />
                                                <label htmlFor="amount" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*סכום</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="paymentForm" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                {
                                                    paymentTypes?.length ?
                                                        <Dropdown
                                                            value={selectedDropPay}
                                                            visible={false}
                                                            onChange={(e) => {
                                                                setSelectedDropPay(e.value);
                                                                handleChange(e.value.id, "payment_method_id");
                                                            }
                                                            }
                                                            options={paymentTypes.map(e => e.description)}
                                                            className="w-full md:w-14rem"
                                                            style={{ minWidth: "100%", width: "100%" }}
                                                        /> : <></>
                                                }
                                                <label htmlFor="paymentForm" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*אמצעי תשלום</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Field name="numOfPayments" render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="p-float-label">
                                                <InputNumber
                                                    inputId="withoutgrouping"
                                                    value={value2}
                                                    onValueChange={(e) => {
                                                        setValue2(e.value);
                                                        handleChange(e.value, "num_of_payments");
                                                    }}
                                                    useGrouping={false}
                                                    min={1}
                                                    max={6}
                                                />
                                                <label htmlFor="numOfPayments" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר תשלומים</label>
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )} />
                                    <Toast ref={toast} />
                                    <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                        message="האם הנך בטוח/ה שברצונך לעדכן על הוצאה חדשה" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                                    <Button
                                        ref={buttonEl}
                                        type="submit"
                                        label="לעדכון"
                                        className="mt-2"
                                        icon="pi pi-wallet"
                                        onClick={() => { setVisible(true) }}
                                        style={{ direction: "ltr" }}
                                    />

                                </form>
                            )} />
                        </Card>
                    </div>
                </div >
            </div >
        </>
    );
}

export default CreateExpense;
