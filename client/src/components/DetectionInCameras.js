import { Card } from "primereact/card";
import React, { useContext, useEffect, useState } from "react";
import { Calendar } from 'primereact/calendar';
import { AutoComplete } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import { fetchData } from "../Hooks/useAxiosGet";
import { Button } from "primereact/button";
import UserContext from "./UserContext";
import { InputText } from "primereact/inputtext";

// const tenant = { building_id: 1 }

export default function DetectionInSecurityCameras(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));

    const [value, setValue] = useState("");
    const [datetimeFrom, setDateTimeFrom] = useState(null);
    const [datetimeTo, setDateTimeTo] = useState(null);

    const [selectedCamera, setSelectedCamera] = useState(null);
    const [filteredCameras, setFilteredCameras] = useState(null);

    const [cameras, setCameras] = useState(null);
    const [toSearch, setToSearch] = useState([]);

    const onToSearchChange = (e) => {
        let _toSearch = [...toSearch];

        if (e.checked)
            _toSearch.push(e.value);
        else
            _toSearch.splice(_toSearch.indexOf(e.value), 1);

        setToSearch(_toSearch);
    }

    const searchCamera = (event) => {
        let query = event.query;
        let _filteredApartmens = [];

        for (let i = 0; i < cameras.length; i++) {
            const camera = cameras[i];
            if (camera.description.indexOf(query) === 0) {
                _filteredApartmens.push(camera);
            }
        }
        setFilteredCameras(_filteredApartmens);
    }

    const getCameras = async (url) => {
        var myData = await fetchData(url);
        setCameras(myData);
    }

    useEffect(() => { getCameras(`camera?building_id=${tenant?.building_id}`) }, [])

    return <>
        <div className="card flex justify-content-center">
            <Card title="איתור במצלמות האבטחה" className="card flex justify-content-center" style={{ width: "40%" }}>
                <div className="flex-auto">
                    <span className="p-float-label">
                        <InputText value={value} onChange={e => setValue(e.target.value)} style={{ width: "100%" }} />
                        <label htmlFor="num">*מספר רכב</label>
                    </span>
                </div>
                <br />
                <div className="flex-auto">
                    <span className="p-float-label">
                        <Calendar id="calendar1" value={datetimeFrom} onChange={(e) => setDateTimeFrom(e.value)} showIcon showTime hourFormat="24" style={{ direction: "ltr", width: "100%" }} />
                        <label htmlFor="calendar1">*ממתי</label>
                    </span>
                </div>
                <br />
                <div className="flex-auto">
                    <span className="p-float-label">
                        <Calendar id="calendar2" value={datetimeTo} onChange={(e) => setDateTimeTo(e.value)} showIcon showTime hourFormat="24" style={{ direction: "ltr", width: "100%" }} />
                        <label htmlFor="calendar2">*עד מתי</label>
                    </span>
                </div>
                <br />
                <div className="field">
                    <span className="p-float-label">
                        <AutoComplete
                            value={selectedCamera}
                            suggestions={filteredCameras}
                            completeMethod={searchCamera}
                            virtualScrollerOptions={{ itemSize: 38 }}
                            field="description"
                            dropdown
                            onChange={(e) => {
                                setSelectedCamera(e.value)
                            }}
                            style={{ direction: "ltr", width: "100%" }}
                        />
                        <label htmlFor="Camera"> *מצלמה רצויה</label>
                    </span>
                </div>
                <br />
                <br />
                <div className="flex justify-content-center">
                    <Button label="הפעלת החיפוש" style={{ direction: "ltr" }}></Button>
                </div>
            </Card>
        </div>
    </>
}