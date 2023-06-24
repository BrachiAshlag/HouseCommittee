
import React, { useState, useEffect, useContext } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { fetchData } from "../Hooks/useAxiosGet";
import UserContext from './UserContext';

// const tenant = { building_id: 1 }
function AddOrSubractDays(startingDate, number) {
    return (new Date(new Date().setDate(startingDate.getDate() + number)))
}

export default function BasicFilterDemo() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [expenses, setExpenses] = useState([]);
    const [paymentType, setPaymentType] = useState([]);

    const [visible, setVisible] = useState(false);

    const [startDate, setStartDate] = useState(AddOrSubractDays(new Date(), -30));
    const [endDate, setEndDate] = useState(new Date());

    const getPaymentType = async (url) => {
        const myData = await fetchData(url);
        setPaymentType(myData);
    }

    function AddOrSubractDaysToState(startingDate, number) {
        setStartDate(new Date(new Date().setDate(startingDate.getDate() + number)))
    }

    const getExpenses = async (url) => {
        const myData = await fetchData(url);
        setExpenses(myData);
    }

    useEffect(() => {
        getExpenses(`expense?building_id=${tenant?.building_id}&startDate=${startDate}&endDate=${endDate}`);
    }, [startDate || endDate])

    useEffect(() => {
        getExpenses(`expense?building_id=${tenant?.building_id}&startDate=${startDate}&endDate=${endDate}`);
    }, [visible])

    useEffect(() => {
        getPaymentType(`paymentForm?building_id=${tenant?.building_id}`);
    }, [])

    const [filters] = useState({
        details: { value: null, matchMode: FilterMatchMode.CONTAINS },
        methods_of_payment: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        num_of_payments: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        // date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        amount: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });
    const [loading, setLoading] = useState(true);

    const dateOptions = [
        "מהשבוע האחרון",
        "מהחודש האחרון",
        "מהשנה האחרונה",
        "בין שני תאריכים ספציפיים",
    ];

    const [selectedOption, setSelectedOption] = useState(dateOptions[1]);


    useEffect(() => {
        setLoading(false);
    }, []);

    const amountBodyTemplate = (rowData) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{rowData.amount}</span>
            </div>
        );
    };

    const detailsItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.details}</span>
            </div>
        );
    };

    const paymentTypeItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.methods_of_payment}</span>
            </div>
        );
    };

    const dateItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.date}</span>
            </div>
        );
    };

    const numOfPaymentsBodyTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.num_of_payments}</span>
            </div>
        );
    };

    const paymentTypeRowFilterTemplate = (options) => {
        return (
            paymentType?.length ?
                <Dropdown
                    value={options}
                    options={paymentType.map(e => e.description)}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    placeholder="אמצעי תשלום"
                    className="p-column-filter"
                    style={{ minWidth: '12rem' }}
                /> : <></>
        );
    };

    const dateFilterTemplate = (options) => {
        return (<>
            <Dropdown
                value={selectedOption}
                onChange={(e) => {
                    setSelectedOption(e.value);
                    switch (e.value) {
                        case "מהשבוע האחרון":
                            AddOrSubractDaysToState(new Date(), -7)
                            setEndDate((new Date()))
                            break;
                        case "מהחודש האחרון":

                            AddOrSubractDaysToState(new Date(), -30);
                            setEndDate(new Date());
                            break;
                        case "מהשנה האחרונה":

                            AddOrSubractDaysToState(new Date(), - 365);
                            setEndDate(new Date());

                            break;
                        case "בין שני תאריכים ספציפיים":

                            setVisible(true)
                            break;
                    }
                }}
                options={dateOptions}
                placeholder="נא לבחור טווח"
                className="w-full md:w-14rem"
                style={{ width: "40%" }}
            />
        </>)
    };

    return (
        <div className="card">
            <DataTable
                value={expenses}
                header={<div style={{ textAlign: "center", fontSize: "25pt" }}>הוצאות</div>}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                emptyMessage="לא נמצאו נתונים מתאימים"
                style={{ margin: "1%" }}
            >
                <Column
                    body={dateItemTemplate}
                    field="date"
                    header="תאריך"
                    filter
                    filterPlaceholder='חיפוש לפי תאריך'
                    filterElement={dateFilterTemplate}
                    style={{ minWidth: '12rem' }}
                    showFilterMenu={false}
                />
                <Column
                    header="פרטים"
                    filterField="details"
                    style={{ minWidth: '12rem' }}
                    body={detailsItemTemplate}
                    filter
                    filterPlaceholder="חיפוש לפי פרטים"
                />
                <Column
                    header="אמצעי תשלום"
                    filterField="methods_of_payment"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: '14rem' }}
                    style={{ minWidth: '14rem' }}
                    body={paymentTypeItemTemplate}
                    filter
                    filterElement={paymentTypeRowFilterTemplate}
                />
                <Column
                    header="סכום ששולם"
                    filterField="amount"
                    style={{ minWidth: '12rem' }}
                    body={amountBodyTemplate}
                    filter
                    filterPlaceholder="חיפוש לפי סכום"
                />
                <Column
                    header="מספר תשלומים"
                    filterField="num_of_payments"
                    style={{ minWidth: '12rem' }}
                    body={numOfPaymentsBodyTemplate}
                    filter
                    filterPlaceholder="חיפוש לפי מספר תשלומים"
                />

            </DataTable>
            <Dialog header="בחר את טווח התאריכים הרצוי" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} >
                <div className="card flex justify-content-center" style={{ direction: "rtl" }}>
                    <div>
                        <span>מתאריך </span>
                        <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                        <span> </span>
                        <span>עד תאריך </span>
                        <Calendar value={endDate} onChange={(e) => setEndDate((e.value))} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                        <span> </span>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}