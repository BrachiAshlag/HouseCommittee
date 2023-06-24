import React, { useRef, useState, useEffect, useContext } from 'react';
import { Card } from 'primereact/card';
import { InputNumber } from 'primereact/inputnumber';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { fetchData, postData, putData, getGovIl } from '../Hooks/useAxiosGet';
import { Toast } from 'primereact/toast';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { AutoComplete } from 'primereact/autocomplete';
import { useNavigate } from "react-router-dom";
import PaymentSettings from "./PaymentSettings";
import UserContext from './UserContext';

// const tenant = {building_id: null}

const CreateBuilding = () => {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const [admin, setAdmin] = useState(null);

    const navigate = useNavigate();

    const [objToData, setObjToData] = useState({
        city: null,
        zip_code: null,
        street: null,
        num_in_street: null,
        payment_setting_id: null,
        bank_name: null,
        bank_account: null,
        branch_address: null,
        branch_num: null,
        account_owner_name: null
    });

    const [buildingSettings, setBuildingSettings] = useState(null);
    const [edit, setEdit] = useState(buildingSettings ? true : false);
    const [selectedCity, setSelectedCity] = useState("");
    const [filteredCities, setFilteredCities] = useState(null);
    const [cities, setCities] = useState(null);
    const [selectedStreet, setSelectedStreet] = useState(null);
    const [filteredStreets, setFilteredStreets] = useState(null);
    const [streets, setStreets] = useState(null);
    const [zipCode, setZipCode] = useState(null);
    const [buildingNumber, setBuildingNumber] = useState(null);
    const [paymantSettingsId, setPaymentSettingsId] = useState(null);
    const [bankName, setBankName] = useState(null);
    const [bankAccount, setBankAccount] = useState(null);
    const [branchAddress, setBranchAddress] = useState(null);
    const [branchNum, setBranchNum] = useState(null);
    const [accountOwnerName, setAccountOwnerName] = useState(null);
    const [isFirst, setIsFirst] = useState(true);
    const [visible, setVisible] = useState(false);
    const [paymentSettings, setPaymentSettings] = useState(false);
    const [buildingId, setBuildingId] = useState(null);
    const toast = useRef(null);
    const buttonEl = useRef(null);

    const handleChange = (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }))
    }

    const getCities = async (url) => {
        const myData = await getGovIl(url);
        if (myData)
            setCities(myData.result.records);
    }

    const getStreets = async (url) => {
        const myData = await getGovIl(url);
        if (myData)
            setStreets(myData.result.records);
    }

    const getBuildingSettings = async (url) => {
        const myData = await fetchData(url);
        if (myData) {
            setBuildingSettings(myData);
        }
    }
    useEffect(() => {
        getCities(`https://data.gov.il/api/3/action/datastore_search?resource_id=5c78e9fa-c2e2-4771-93ff-7f400a12f7ba&limit=500000`);
    }, [])

    useEffect(() => {
        if (tenant?.building_id) {
            getBuildingSettings(`building/${tenant?.building_id}`);
        }
    }, [])


    useEffect(() => {
        if (!tenant)
            setAdmin(JSON.parse(localStorage.getItem("admin")));
    }, [tenant])

    const searchCity = (event) => {
        if (cities?.length) {
            let query = event.query;
            let _filteredCities = [];

            for (let i = 0; i < cities?.length; i++) {
                let city = cities[i];
                if (city.שם_ישוב.indexOf(query) === 0) {
                    _filteredCities.push(city);
                }
            }
            setFilteredCities(_filteredCities);
        }
    }

    const searchStreet = (event) => {
        if (streets?.length) {
            let query = event.query;
            let _filteredStreets = [];

            for (let i = 0; i < streets?.length; i++) {
                let street = streets[i];
                if (street.שם_רחוב.indexOf(query) === 0) {
                    _filteredStreets.push(street);
                }
            }
            setFilteredStreets(_filteredStreets);
        }
    }

    useEffect(() => {
        if (buildingSettings != null) {
            if (buildingSettings.city != null)
                setSelectedCity(buildingSettings.city);
            if (buildingSettings.zip_code != null)
                setZipCode(buildingSettings.zip_code);
            if (buildingSettings.street != null)
                setSelectedStreet(buildingSettings.street);
            if (buildingSettings.num_in_street != null)
                setBuildingNumber(buildingSettings.num_in_street);
            if (buildingSettings.payment_setting_id != null)
                setPaymentSettingsId(buildingSettings.payment_setting_id);
            if (buildingSettings.bank_name != null)
                setBankName(buildingSettings.bank_name);
            if (buildingSettings.bank_account != null)
                setBankAccount(buildingSettings.bank_account);
            if (buildingSettings.branch_address != null)
                setBranchAddress(buildingSettings.branch_address);
            if (buildingSettings.branch_num != null)
                setBranchNum(buildingSettings.branch_num);
            if (buildingSettings.account_owner_name != null)
                setAccountOwnerName(buildingSettings.account_owner_name);
            setEdit(true);
            setIsFirst(false);
        }
    }, [buildingSettings])

    useEffect(() => {
        if (selectedCity != null) {
            getStreets(`https://data.gov.il/api/3/action/datastore_search?resource_id=9ad3862c-8391-4b2f-84a4-2d4c68625f4b&q=${selectedCity.סמל_ישוב}&limit=500000`);
        }
    }, [selectedCity])

    useEffect(() => {
        if (admin?.building_id != null) {
            localStorage.removeItem("admin");
            localStorage.setItem("admin", JSON.stringify(admin));
        }

    }, [admin])


    const accept = async () => {

        if (isFirst) {
            await postData(`building`, objToData);
            const x = await fetchData(`building/Last`);
            setBuildingId(x);
        }
        else {
            const x = buildingSettings;
            if (x.city != objToData.city && objToData.city != null)
                x.city = objToData.city;
            if (x.zip_code != objToData.zip_code && objToData.zip_code != null)
                x.zip_code = objToData.zip_code;
            if (x.street != objToData.street && objToData.street != null)
                x.street = objToData.street;
            if (x.num_in_street != objToData.num_in_street && objToData.num_in_street != null)
                x.num_in_street = objToData.num_in_street;
            if (x.payment_setting_id != objToData.payment_setting_id && objToData.payment_setting_id != null)
                x.payment_setting_id = objToData.payment_setting_id;
            if (x.bank_name != objToData.bank_name)
                x.bank_name = objToData.bank_name;
            if (x.bank_account != objToData.bank_account)
                x.bank_account = objToData.bank_account;
            if (x.branch_address != objToData.branch_address)
                x.branch_address = objToData.branch_address;
            if (x.branch_num != objToData.branch_num && objToData.branch_num != null)
                x.branch_num = objToData.branch_num;
            if (x.account_owner_name != objToData.account_owner_name && objToData.account_owner_name != null)
                x.account_owner_name = objToData.account_owner_name;
            await putData(`building/${tenant?.building_id}`, x);

        }
        toast.current.show({ severity: 'success', summary: 'Confirmed', detail: 'המידע נשלח בהצלחה', life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', summary: 'Rejected', detail: 'המידע לא נשלח', life: 3000 });
    };

    return (
        <>
            {!paymentSettings ?
                <div className="flex justify-content-center" style={{ padding: "5%" }}>
                    <Card title="הגדרות בניין" style={{ width: "50%" }}>
                        <div className="flex flex-column gap-3">
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>עיר: </span>
                                <AutoComplete
                                    disabled={edit}
                                    value={selectedCity}
                                    suggestions={filteredCities}
                                    completeMethod={searchCity}
                                    style={{ direction: "ltr" }}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="שם_ישוב"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedCity(e.target.value);
                                        handleChange(e.target.value.שם_ישוב, "city");
                                    }}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>רחוב: </span>
                                <AutoComplete
                                    disabled={edit || selectedCity == ""}
                                    value={selectedStreet}
                                    suggestions={filteredStreets}
                                    completeMethod={searchStreet}
                                    style={{ direction: "ltr" }}
                                    virtualScrollerOptions={{ itemSize: 38 }}
                                    field="שם_רחוב"
                                    dropdown
                                    onChange={(e) => {
                                        setSelectedStreet(e.target.value);
                                        handleChange(e.target.value.שם_רחוב, "street");
                                    }}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מיקוד: </span>
                                <InputNumber
                                    disabled={edit}
                                    inputId="withoutgrouping"
                                    value={zipCode}
                                    onValueChange={(e) => {
                                        setZipCode(e.target.value);
                                        handleChange(e.target.value, "zip_code")
                                    }}
                                    useGrouping={false}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר בניין: </span>
                                <InputNumber
                                    disabled={edit}
                                    inputId="withoutgrouping"
                                    value={buildingNumber}
                                    onValueChange={(e) => {
                                        setBuildingNumber(e.target.value);
                                        handleChange(e.target.value, "num_in_street")
                                    }}
                                    useGrouping={false}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>שם הבנק: </span>
                                <InputText
                                    disabled={edit}
                                    id="bankName"
                                    value={bankName}
                                    onChange={(e) => {
                                        setBankName(e.target.value)
                                        handleChange(e.target.value, "bank_name")
                                    }}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר חשבון: </span>
                                <InputNumber
                                    disabled={edit}
                                    inputId="withoutgrouping"
                                    value={bankAccount}
                                    onValueChange={(e) => {
                                        setBankAccount(e.target.value);
                                        handleChange(e.target.value, "bank_account")
                                    }}
                                    useGrouping={false}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>כתובת הסניף: </span>
                                <InputText
                                    disabled={edit}
                                    id="branchAddress"
                                    value={branchAddress}
                                    onChange={(e) => {
                                        setBranchAddress(e.target.value)
                                        handleChange(e.target.value, "branch_address")
                                    }}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}>מספר הסניף: </span>
                                <InputNumber
                                    disabled={edit}
                                    inputId="withoutgrouping"
                                    value={branchNum}
                                    onValueChange={(e) => {
                                        setBranchNum(e.target.value);
                                        handleChange(e.target.value, "branch_num")
                                    }}
                                    useGrouping={false}
                                />
                            </span>
                            <span>
                                <span style={{ fontSize: "1rem", fontWeight: "700", marginBottom: "0.5rem" }}> שם בעל החשבון: </span>
                                <InputText
                                    disabled={edit}
                                    id="branchAddress"
                                    value={accountOwnerName}
                                    onChange={(e) => {
                                        setAccountOwnerName(e.target.value)
                                        handleChange(e.target.value, "account_owner_name")
                                    }}
                                />
                            </span>
                        </div><br />

                        {edit && tenant?.is_building_committee &&
                            <Button type="submit" label="ערוך הגדרות" className="mt-2" icon="pi pi-file-edit" onClick={() => { setEdit(false); }} />
                        }
                        {!edit && !isFirst && tenant?.is_building_committee &&
                            <>
                                <Toast ref={toast} />
                                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                    message="האם הנך בטוח/ה שברצונך לשמור" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                                <div className="card flex justify-content-">
                                    <Button
                                        ref={buttonEl}
                                        onClick={() => {
                                            setVisible(true);
                                        }}
                                        icon="pi pi-check"
                                        label="שמירה"
                                    />
                                </div>
                            </>}

                        {isFirst && <div>
                            <Button
                                ref={buttonEl}
                                onClick={() => {
                                    setPaymentSettings(true);
                                }}
                                icon="pi pi-check"
                                label="להגדרות גביה"
                            />
                        </div>}

                    </Card>
                </div> :
                <PaymentSettings building={objToData} buildingId={buildingId}></PaymentSettings>
            }
        </>
    )
}

export default CreateBuilding;