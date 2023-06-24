import React, { useRef, useState, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { RadioButton } from "primereact/radiobutton";
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchData, postData, putData } from '../Hooks/useAxiosGet';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import CreateBuilding from './CreateBuilding';
import { useNavigate } from "react-router-dom";
import UserContext from './UserContext';

// const tenant = { building_id: 1, entry_id: 1 }

const PaymentSettings = (props) => {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();

    const options = [{ id: -1, des: "תשלום זהה לכל הדירות " }, { id: -2, des: "סכום שונה לכל דירה " }];
    const [objToData, setObjToData] = useState({
        same_price: null,
        one_room: null,
        two_rooms: null,
        three_rooms: null,
        four_rooms: null,
        five_rooms: null,
        six_rooms: null,
        day_in_month: 1,
        often: 1
    });

    const [building, setBuilding] = useState({
        city: props?.building?.city,
        zip_code: props?.building?.zip_code,
        street: props?.building?.street,
        num_in_street: props?.building?.num_in_street,
        payment_setting_id: props?.building?.payment_setting_id,
        bank_name: props?.building?.bank_name,
        bank_account: props?.building?.bank_account,
        branch_address: props?.building?.branch_address,
        branch_num: props?.building?.branch_num,
        account_owner_name: props?.building?.account_owner_name
    });
    const [paymentSettings, setPaymentSettings] = useState(null);
    const [edit, setEdit] = useState(paymentSettings ? true : false);
    const [selectedRadio, setSelectedRadio] = useState(options[0]);
    const [showSame, setShowSame] = useState(true);
    const [sum, setSum] = useState(0);
    const [one, setOne] = useState(0);
    const [two, setTwo] = useState(0);
    const [three, setThree] = useState(0);
    const [four, setFour] = useState(0);
    const [five, setFive] = useState(0);
    const [six, setSix] = useState(0);
    const [day, setDay] = useState(1);
    const [period, setPeriod] = useState(1);
    const [isFirst, setIsFirst] = useState(true);
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }))
    }

    const handleBuilding = (selected, key) => {
        setBuilding((prev) => ({ ...prev, [key]: selected }))
    }

    const getPaymentSettings = async (url) => {
        if (!props.building) {
            const myData = await fetchData(url);
            if (myData) {
                setPaymentSettings(myData);
            }
        }
    }

    useEffect(() => {
        if (!props.building) {
            getPaymentSettings(`paymentSettings?building_id=${tenant?.building_id}`);
        }
    }, [])

    const CreateBuilding = async () => {
        // const x = await fetchData(`paymentSettings/Last`);
        // handleBuilding(x[0]['LAST_INSERT_ID()'], "payment_setting_id");
        await postData(`building`, building)
        const build = await fetchData(`building/last`);
        setAdmin((prev) => ({ ...prev, "building_id": build[0]['LAST_INSERT_ID()'] }))

    }

    useEffect(() => {
        if (building?.payment_setting_id) {
            CreateBuilding();
        }
    }, [building])

    useEffect(() => {
        
        if (!tenant)
            setAdmin(JSON.parse(localStorage.getItem("admin")));
    }, [tenant])

    useEffect(() => {
        if (admin?.building_id != null) {
            localStorage.removeItem("admin");
            localStorage.setItem("admin", JSON.stringify(admin));
            navigate("/createEntry");
        }
        
    }, [admin])

    useEffect(() => {
        if (paymentSettings != null) {
            if (paymentSettings.same_price == null)
                setSelectedRadio(options[1]);
            if (paymentSettings.same_price == null)
                setShowSame(false);
            if (paymentSettings.same_price != null)
                setSum(paymentSettings.same_price);
            if (paymentSettings.one_room != null)
                setOne(paymentSettings.one_room);
            if (paymentSettings.two_rooms != null)
                setTwo(paymentSettings.two_rooms);
            if (paymentSettings.three_rooms != null)
                setThree(paymentSettings.three_rooms);
            if (paymentSettings.four_rooms != null)
                setFour(paymentSettings.four_rooms);
            if (paymentSettings.five_rooms != null)
                setFive(paymentSettings.five_rooms);
            if (paymentSettings.six_rooms != null)
                setSix(paymentSettings.six_rooms);
            setDay(paymentSettings.day_in_month);
            setPeriod(paymentSettings.often);
            setEdit(true);
            setIsFirst(false)
        }

    }, [paymentSettings])

    useEffect(() => {
        getPaymentSettings(`paymentSettings?building_id=${tenant?.building_id}`);
    }, [])

    const accept = async () => {
        if (isFirst) {
            await postData(`paymentSettings`, objToData);
            const x = await fetchData(`paymentSettings/Last`);
            handleBuilding(x[0]['LAST_INSERT_ID()'], "payment_setting_id");

        }
        else {
            const x = paymentSettings;
            if (x.same_price != objToData.same_price)
                x.same_price = objToData.same_price;
            if (x.one_room != objToData.one_room)
                x.one_room = objToData.one_room;
            if (x.two_rooms != objToData.two_rooms)
                x.two_rooms = objToData.two_rooms;
            if (x.three_rooms != objToData.three_rooms)
                x.three_rooms = objToData.three_rooms;
            if (x.four_rooms != objToData.four_rooms)
                x.four_rooms = objToData.four_rooms;
            if (x.five_rooms != objToData.five_rooms)
                x.five_rooms = objToData.five_rooms;
            if (x.six_rooms != objToData.six_rooms)
                x.six_rooms = objToData.six_rooms;
            if (x.day_in_month != objToData.day_in_month && objToData.day_in_month != null)
                x.day_in_month = objToData.day_in_month;
            if (x.often != objToData.often && objToData.often != null)
                x.often = objToData.often;
            await putData(`paymentSettings?building_id=${tenant?.building_id}`, x);
            
        }
        toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'המידע נשלח בהצלחה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'המידע לא נשלח', life: 3000 });
    };

    return (
        <div className="flex justify-content-center" style={{ padding: "5%" }}>
            <Card title="הגדרות תשלום" style={{ width: "50%" }}>
                <div className="flex flex-column gap-3">
                    {options.map((option) => {
                        return (
                            <div key={option.id} className="flex align-items-center">
                                <RadioButton
                                    disabled={edit}
                                    inputId={option.id}
                                    name="option"
                                    value={option}
                                    onChange={(e) => {
                                        setSelectedRadio(e.value);
                                        if (e.value.des == "תשלום זהה לכל הדירות ") {
                                            setShowSame(true);
                                        }
                                        else {
                                            handleChange(null, "same_price");
                                            setShowSame(false);
                                        }

                                    }}
                                    checked={selectedRadio.id === option.id}
                                />
                                <label htmlFor={option.id} className="ml-2">{`${option.des}`}</label>
                            </div>
                        );
                    })}
                    <span>
                        {showSame && <>
                            <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>סכום </span>
                            <InputNumber
                                readOnly={edit}
                                inputId="withoutgrouping"
                                value={sum}
                                onValueChange={(e) => {
                                    setSum(e.value);
                                    handleChange(e.target.value, "same_price")
                                }}
                                useGrouping={false}
                                minFractionDigits={2}
                            /></>}
                    </span>

                    {!showSame &&
                        <>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>חדר 1 </span>
                                <InputNumber
                                    readOnly={edit}
                                    inputId="withoutgrouping"
                                    value={one}
                                    onValueChange={(e) => {
                                        setOne(e.value);
                                        handleChange(e.target.value, "one_room")
                                    }}
                                    useGrouping={false}
                                    minFractionDigits={2}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>2 חדרים </span>
                                <InputNumber
                                    readOnly={edit}
                                    inputId="withoutgrouping"
                                    value={two}
                                    onValueChange={(e) => {
                                        setTwo(e.value);
                                        handleChange(e.target.value, "two_rooms")
                                    }}
                                    useGrouping={false}
                                    minFractionDigits={2}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>3 חדרים </span> : <></>
                                <InputNumber
                                    readOnly={edit}
                                    inputId="withoutgrouping"
                                    value={three}
                                    onValueChange={(e) => {
                                        setThree(e.value);
                                        handleChange(e.target.value, "three_rooms")
                                    }}
                                    useGrouping={false}
                                    minFractionDigits={2}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>4 חדרים </span>

                                <InputNumber
                                    readOnly={edit}
                                    inputId="withoutgrouping"
                                    value={four}
                                    onValueChange={(e) => {
                                        setFour(e.value);
                                        handleChange(e.target.value, "four_rooms")
                                    }}
                                    useGrouping={false}
                                    minFractionDigits={2}
                                />
                            </span>
                            <span>

                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>5 חדרים </span>
                                <InputNumber
                                    readOnly={edit}
                                    inputId="withoutgrouping"
                                    value={five}
                                    onValueChange={(e) => {
                                        setFive(e.value);
                                        handleChange(e.target.value, "five_rooms")
                                    }}
                                    useGrouping={false}
                                    minFractionDigits={2}
                                />
                            </span>
                            <span>

                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>6+ חדרים </span> : <></>

                                <InputNumber
                                    readOnly={edit}
                                    inputId="withoutgrouping"
                                    value={six}
                                    onValueChange={(e) => {
                                        setSix(e.value);
                                        handleChange(e.target.value, "six_rooms")
                                    }}
                                    useGrouping={false}
                                    minFractionDigits={2}
                                />
                            </span>
                        </>}
                </div><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>יום בחודש בו תתבצע הגבייה </span>
                <InputText
                    readOnly={edit}
                    value={day}
                    onChange={(e) => {
                        setDay(e.target.value);
                        handleChange(e.target.value, "day_in_month")
                    }}
                    style={{ width: "250px" }}
                /><br /><br />
                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>תקופת גבייה (בחודשים) </span>
                <InputText
                    readOnly={edit}
                    value={period}
                    onChange={(e) => {
                        setPeriod(e.target.value);
                        handleChange(e.target.value, "often")
                    }}
                    style={{ width: "250px" }}
                /><br /><br />
                {
                    edit ?
                        <Button type="submit" label="ערוך הגדרות" className="mt-2" icon="pi pi-file-edit" onClick={() => { setEdit(false); }} /> :
                        <><Toast ref={toast} />
                            <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                message="האם הנך בטוח/ה שברצונך לעדכן את הגדרות התשלום" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                            <div className="card flex justify-content-">
                                <Button
                                    ref={buttonEl}
                                    onClick={() => {
                                        setVisible(true);
                                    }}
                                    icon="pi pi-check"
                                    label="שמור"
                                />
                            </div></>
                }
            </Card>
        </div>
    )
}

export default PaymentSettings;