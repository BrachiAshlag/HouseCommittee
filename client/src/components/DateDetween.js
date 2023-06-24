
import React, { useState } from 'react';
import { Calendar } from "primereact/calendar";
import { Button } from 'primereact/button';


export default function DateBetween() {

    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    return (
        <div className="card flex justify-content-center">
            <div>
                <span>מתאריך </span>
                <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                <span> </span>
                <span>עד תאריך </span>
                <Calendar value={endDate} onChange={(e) => setEndDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr" }} />
                <span> </span>
                <Button type="submit" label="סנן" style={{ direction: "ltr" }} />
            </div>
        </div>
    )
}