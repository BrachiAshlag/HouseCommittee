
import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { fetchData } from "../Hooks/useAxiosGet"

const tenant = { building_id: 1 }
function AddOrSubractDays(startingDate, number) {
    return (new Date(new Date().setDate(startingDate.getDate() + number)));
}

export default function BalanceTable() {
    const [balance, setBalance] = useState([]);
    const [types, setTypes] = useState(["הכנסה", "הוצאה"]);

    const [visible, setVisible] = useState(false);

    const [startDate, setStartDate] = useState(AddOrSubractDays(new Date(), -30).toISOString().slice(0, 10));
    const [endDate, setEndDate] = useState(new Date().toISOString().slice(0, 10));

    const getBalance = async (url) => {
        const d = await fetchData(url);
        const myData = d.balance;
        console.log(myData);
        setBalance(myData);
    }

    function AddOrSubractDaysToState(startingDate, number) {
        setStartDate(new Date(new Date().setDate(startingDate.getDate() + number)).toISOString().slice(0, 10))
    }

    useEffect(() => {
        console.log(`balance?building_id=${tenant.building_id}&startDate=${startDate}&endDate=${endDate}`);
        getBalance(`balance?building_id=${tenant.building_id}&startDate=${startDate}&endDate=${endDate}`);
    }, [startDate||endDate])


    const [filters, setFilters] = useState({
        details: { value: null, matchMode: FilterMatchMode.CONTAINS },
        type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        amount: { value: null, matchMode: FilterMatchMode.STARTS_WITH }
    });
    const [loading, setLoading] = useState(true);

    const [selectedOption, setSelectedOption] = useState(null);
    const dateOptions = [
        "פריטים מהשבוע האחרון",
        "פריטים מהחודש האחרון",
        "פריטים מהשנה האחרונה",
        "פריטים בין שני תאריכים ספציפיים",
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

    const typeItemTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.type}</span>
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

    const balanceBodyTemplate = (option) => {
        return (
            <div className="flex align-items-center gap-2">
                <span>{option.balance}</span>
            </div>
        );
    };

    const typeRowFilterTemplate = (options) => {

        return (
            types?.length ?
                <Dropdown
                    value={options}
                    options={types}
                    onChange={(e) => options.filterApplyCallback(e.value)}
                    placeholder="סוג"
                    className="p-column-filter"
                    style={{ minWidth: '12rem' }}
                /> : <></>
        );
    };

    return (
        <div className="card">
            <DataTable
                value={balance}
                paginator
                rows={10}
                dataKey="id"
                filters={filters}
                filterDisplay="row"
                loading={loading}
                header={
                    <div style={{textAlign: "center", fontSize: "25pt"}}>מאזן</div>
                }
                emptyMessage="לא נמצאו פריטים מתאימים"
            >
                <Column
                    body={dateItemTemplate}
                    field="date"
                    header="תאריך"
                    style={{ minWidth: '12rem' }}
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
                                    case "פריטים מהשבוע האחרון":
                                        setStartDate(AddOrSubractDaysToState(new Date(), -7).toISOString().slice(0, 10))
                                        break;
                                    case "פריטים מהחודש האחרון":
                                        setStartDate(AddOrSubractDaysToState(new Date(), -30).toISOString().slice(0, 10))
                                        break;
                                    case "פריטים מהשנה האחרונה":
                                        setStartDate(AddOrSubractDaysToState(new Date(new Date() - 365)).toISOString().slice(0, 10))
                                        break;
                                    case "פריטים בין שני תאריכים ספציפיים":
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
                    </div>
                    }
                />
                <Column
                    header="פרטים"
                    filterField="details"
                    style={{ minWidth: '12rem' }}
                    body={detailsItemTemplate}
                    filter
                    filterPlaceholder="חפש לפי פרטים"
                />
                <Column
                    header="סוג"
                    filterField="type"
                    showFilterMenu={false}
                    filterMenuStyle={{ width: '14rem' }}
                    style={{ minWidth: '14rem' }}
                    body={typeItemTemplate}
                    filter
                    filterElement={typeRowFilterTemplate}
                />
                <Column
                    header="סכום"
                    filterField="amount"
                    style={{ minWidth: '12rem' }}
                    body={amountBodyTemplate}
                    filter
                    filterPlaceholder="חפש לפי סכום"
                />
                <Column
                    header="מאזן"
                    filterField="balance"
                    style={{ minWidth: '12rem' }}
                    body={balanceBodyTemplate}
                />

            </DataTable>
            {/* :<></> }*/}
            <Dialog header="בחר את טווח התאריכים הרצוי" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} >
                <div className="card flex justify-content-center" style={{ direction: "ltr" }}>
                    <div>
                        <span>מתאריך </span>
                        <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} showIcon />
                        <span> </span>
                        <span>עד תאריך </span>
                        <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} showIcon /*style={{direction: "ltr"}}*/ />
                        <span> </span>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}