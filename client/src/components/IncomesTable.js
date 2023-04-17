
import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { fetchData, postData } from "../Hooks/useAxiosGet"

const tenant = { building_id: 1 }
function AddOrSubractDays(startingDate, number) {
    return new Date(new Date().setDate(startingDate.getDate() + number));
}

export default function IncomesTable() {
    const [incomes, setIncomes] = useState([]);
    const [paymentType, setPaymentType] = useState([]);

    const [visible, setVisible] = useState(false);

    const [startDate, setStartDate] = useState(AddOrSubractDays(new Date(), -30).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

    function AddOrSubractDaysToState(startingDate, number) {
        setStartDate(new Date(new Date().setDate(startingDate.getDate() + number)).toISOString().slice(0,10));
    }

    const getPaymentType = async (url) => {
        const myData = await fetchData(url);
        console.log(myData);
        setPaymentType(myData);
    }

    const getIncomes = async (url) => {
        const myData = await fetchData(url);
        console.log(myData);
        setIncomes(myData);
    }

    useEffect(() => {
        getIncomes(`tenantPayment?building_id=${tenant.building_id}&startDate=${startDate}&endDate=${endDate}`);
        getPaymentType(`paymentForm?building_id=${tenant.building_id}`);
    }, [startDate||endDate])


    const [filters, setFilters] = useState({
        details: { value: null, matchMode: FilterMatchMode.CONTAINS },
        methods_of_payment: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        num_of_payments: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        amount: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });
    const [loading, setLoading] = useState(true);

    const [selectedOption, setSelectedOption] = useState(null);
    const dateOptions = [
        "הכנסות מהשבוע האחרון",
        "הכנסות מהחודש האחרון",
        "הכנסות מהשנה האחרונה",
        "הכנסות בין שני תאריכים ספציפיים",
    ];

    useEffect(() => {
        setLoading(false);
    }, [ startDate || endDate ]);

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

    return (
        <div className="card">
            <DataTable
                value={incomes}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                header={
                    <div style={{textAlign: "center", fontSize: "25pt"}}>הכנסות</div>
                }
                emptyMessage="לא נמצאו פריטים מתאימים"
            >
                <Column
                    body={dateItemTemplate}
                    field="date"
                    header="תאריך"
                    filter
                    filterPlaceholder='חיפוש לפי תאריך'
                    filterHeader={
                        <div className="card flex justify-content-center">
                        <Dropdown
                            value={selectedOption}
                            onChange={(e) => {
                                console.log("e.value", e.value);
                                setSelectedOption(e.value);
                                switch (e.value) {
                                    case "הכנסות מהשבוע האחרון":
                                        AddOrSubractDaysToState(new Date(), -7).toISOString().slice(0, 10)
                                        break;
                                    case "הכנסות מהחודש האחרון":
                                        AddOrSubractDaysToState(new Date(), -30).toISOString().slice(0, 10)
                                        break;
                                    case "הכנסות מהשנה האחרונה":
                                        AddOrSubractDaysToState(new Date(new Date() - 365)).toISOString().slice(0, 10)
                                        break;
                                    case "הכנסות בין שני תאריכים ספציפיים":
                                        setVisible(true)
                                        break;
                                }
                            }}
                            options={dateOptions}
                            placeholder="נא לבחור טווח"
                            className="w-full md:w-14rem"
                            style={{ width: "40%" }}
                        /> 
                        {/* לעשות אולי כפתור מחולק */}
                        <Button 
                            icon="pi pi-filter-slash" 
                            onClick={() => {
                                setSelectedOption(null);   
                            }} 
                            style={{ direction: "ltr" }}
                        />
                        {/* <button type="button" class="p-column-filter-menu-button p-link" aria-haspopup="true" aria-expanded="false" aria-label="Filter" onClick={() => {setSelectedOption(null) }}>
                            <span class="pi pi-filter-icon pi-filter-slash" aria-hidden="true"></span>
                        </button> */}
                    </div>
                    }
                    style={{ minWidth: '12rem' }}
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
            {/* :<></> }*/}
            <Dialog header="בחר את טווח התאריכים הרצוי" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} >
                <div className="card flex justify-content-center" style={{ direction: "ltr" }}>
                    <div>
                        <span>מתאריך </span>
                        <Calendar value={startDate} onChange={(e) => setStartDate(e.value.toISOString().slice(0,10))} showIcon />
                        <span> </span>
                        <span>עד תאריך </span>
                        <Calendar value={endDate} onChange={(e) => setEndDate(e.value.toISOString().slice(0,10))} showIcon /*style={{direction: "ltr"}}*/ />
                        <span> </span>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}