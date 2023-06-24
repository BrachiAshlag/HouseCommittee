import { useContext, useEffect, useState } from "react";
import { Calendar } from "primereact/calendar";
import { Card } from "primereact/card";
import { Carousel } from "primereact/carousel";
import { AutoComplete } from "primereact/autocomplete";
import { fetchData } from "../Hooks/useAxiosGet";
import UserContext from "./UserContext";

// const tenant = { apartment_id: 1, building_id: 1, is_building_committee: false };

export default function PDFView(props) {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [tenantPayments, setTenantPayments] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);

    const [selectedApartment, setSelectedApartment] = useState(null);
    const [filteredApartments, setFilteredApartments] = useState(null);
    const [apartments, setApartments] = useState(null);

    const responsiveOptions = [
        {
            breakpoint: '950px',
            numVisible: 1,
            numScroll: 1
        },
        {
            breakpoint: '800px',
            numVisible: 2,
            numScroll: 1
        },
        {
            breakpoint: '767px',
            numVisible: 1,
            numScroll: 1
        }
    ];

    const searchApartments = (event) => {
        if (apartments?.length) {
            let query = event.query;
            let _filteredApartments = [];

            for (let i = 0; i < apartments?.length; i++) {
                let apartment = apartments[i];
                if (apartment.description.toString().indexOf(query) === 0) {
                    _filteredApartments.push(apartment);
                }
            }
            setFilteredApartments(_filteredApartments);
        }
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

    const getTenantReceipt = async (url) => {
        const myData = await fetchData(url)
        setTenantPayments(myData);
    }

    useEffect(() => {
        getApartments(`apartment/description?building_id=${tenant?.building_id}`);
    }, [])

    useEffect(() => {
        if (startDate != null && endDate != null) {
            if (selectedApartment != null) {
                getTenantReceipt(`tenantPayment/rangeByApartment/${selectedApartment.id}?startDate=${startDate}&endDate=${endDate}`);
            }
            else if (!tenant.is_building_committee) {
                getTenantReceipt(`tenantPayment/rangeByApartment/${tenant?.apartment_id}?startDate=${startDate}&endDate=${endDate}`);
            }
        }
        else {
            if (selectedApartment != null) {
                getTenantReceipt(`tenantPayment/all/${selectedApartment.id}`);
            }
            else if (!tenant.is_building_committee) {
                getTenantReceipt(`tenantPayment/all/${tenant?.apartment_id}`);
            }
        }
    }, [startDate, endDate, selectedApartment])

    const tenantPayment = (tenantPay) => {

        return (
            <div className="flex justify-content-center" style={{ borderColor: "#6366F1" }}>
                <iframe src={`http://localhost:8000/tenantPayment/openFile/${tenantPay.id}`} style={{ height: "500px" }}></iframe>
            </div>
        );
    };

    return (
        <>
            <div className="flex justify-content-center">
                <Card style={{ width: "100%" }} >
                    <h2>אישורי תשלום</h2>
                    <span style={{ padding: "20px" }}>
                        {tenant?.is_building_committee &&
                            <div className="flex justify-content-start flex-column" style={{ width: "90%" }}>
                                <h4 htmlFor="add" style={{ width: "150%" }}>הדירה שברצונך להציג את אישורי התשלום שלה</h4>
                                <AutoComplete
                                    value={selectedApartment}
                                    suggestions={filteredApartments}
                                    completeMethod={searchApartments}
                                    style={{ direction: "ltr", width: "19%" }}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="description"
                                    dropdown
                                    onChange={(e) => { setSelectedApartment(e.value) }}
                                    aria-describedby="help"
                                />
                                <small id="help">
                                    שדה חובה
                                </small>
                            </div>}
                        <br />
                        <div className="flex flex-column justify-content-center" style={{ direction: "rtl" }}>
                            <h4>נתן להזין את טווח התאריכים לקבלת אישורי התשלום</h4>
                            <div className="flex justify-content-start">
                                <span className="p-float-label" style={{ direction: "ltr" }} >
                                    <Calendar value={startDate} onChange={(e) => setStartDate(e.value)} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr", margin: "3px" }} />
                                    <label htmlFor="add" style={{ width: "150%" }}>מתאריך</label>
                                </span><br />
                                <span className="p-float-label" style={{ direction: "ltr" }} >
                                    <Calendar value={endDate} onChange={(e) => setEndDate((e.value))} dateFormat="dd/mm/yy" showIcon style={{ direction: "ltr", margin: "3px" }} />
                                    <label htmlFor="add" style={{ width: "150%" }}>עד תאריך</label>
                                </span>

                            </div>
                        </div>
                    </span>


                    <br /><br />
                    {tenantPayments?.length > 0 &&
                        <Carousel
                            value={tenantPayments}
                            numScroll={1}
                            numVisible={3}
                            autoplayInterval={3000}
                            responsiveOptions={responsiveOptions}
                            itemTemplate={tenantPayment}
                            style={{ width: "90%", height: "95%", direction: "ltr" }}
                        />}
                </Card>
            </div >
        </>
    )


}