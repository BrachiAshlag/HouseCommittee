
import React, { useState, useEffect, useContext } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { fetchData } from "../Hooks/useAxiosGet"
import UserContext from './UserContext';

// const tenant = { building_id: 1 }
function AddOrSubractDays(startingDate, number) {
    return (new Date(new Date().setDate(startingDate.getDate() + number)));
}

export default function BalanceTable() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [balance, setBalance] = useState([]);
    const [types, setTypes] = useState(["הכנסה", "הוצאה"]);

    const [visible, setVisible] = useState(false);

    const [startDate, setStartDate] = useState(AddOrSubractDays(new Date(), -30));
    const [endDate, setEndDate] = useState(new Date());

    const getBalance = async (url) => {
        const d = await fetchData(url);
        const myData = d.balance;
        setBalance(myData);
    }

    function AddOrSubractDaysToState(startingDate, number) {
        setStartDate(new Date(new Date().setDate(startingDate.getDate() + number)))
    }

    useEffect(() => {
        getBalance(`balance?building_id=${tenant?.building_id}&startDate=${startDate}&endDate=${endDate}`);
    }, [startDate, endDate])


    const [filters, setFilters] = useState({
        details: { value: null, matchMode: FilterMatchMode.CONTAINS },
        type: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        date: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
    }, [startDate || endDate]);

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
            types?.length &&
            <Dropdown
                value={options}
                options={types}
                onChange={(e) => options.filterApplyCallback(e.value)}
                placeholder="סוג"
                className="p-column-filter"
                style={{ minWidth: '12rem' }}
            />
        );
    };

    const dateFilterTemplate = () => {
        return (
            <Dropdown
                value={selectedOption}
                onChange={(e) => {
                    setSelectedOption(e.value);
                    switch (e.value) {
                        case "מהשבוע האחרון":
                            AddOrSubractDaysToState(new Date(), -7);
                            break;
                        case "מהחודש האחרון":
                            AddOrSubractDaysToState(new Date(), -30);
                            break;
                        case "מהשנה האחרונה":
                            AddOrSubractDaysToState(new Date(), -365);
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
        )
    }

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
                    <div style={{ textAlign: "center", fontSize: "25pt" }}>מאזן</div>
                }
                emptyMessage="לא נמצאו נתונים מתאימים"
                style={{ margin: "1%" }}
            >
                <Column
                    body={dateItemTemplate}
                    field="date"
                    header="תאריך"
                    style={{ minWidth: '12rem' }}
                    filter
                    filterPlaceholder='חיפוש לפי תאריך'
                    filterElement={dateFilterTemplate}
                    showFilterMenu={false}
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
            <Dialog header="בחר את טווח התאריכים הרצוי" visible={visible} style={{ width: '50vw' }} onHide={() => setVisible(false)} >
                <div className="card flex justify-content-center" style={{ direction: "rtl" }}>
                    <div>
                        <span>מתאריך </span>
                        <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                        <span> </span>
                        <span>עד תאריך </span>
                        <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                        <span> </span>
                    </div>
                </div>
            </Dialog>
        </div>
    );
}