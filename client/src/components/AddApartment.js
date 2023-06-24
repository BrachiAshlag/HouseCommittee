import React, { useContext, useEffect, useRef, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { AutoComplete } from 'primereact/autocomplete';
import { classNames } from 'primereact/utils';
import { Card } from 'primereact/card';
import { ConfirmPopup } from 'primereact/confirmpopup';
import { Toast } from 'primereact/toast';
import { fetchData, postData } from '../Hooks/useAxiosGet';
import { InputNumber } from 'primereact/inputnumber';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

// const tenant = { building_id: 1, apartment_id: 1 }
export default function AddApartment() {
    // const tenant = useContext(UserContext)?.data;
    const [tenant, setTenant] = useState(JSON.parse(localStorage.getItem("tenant")));
    const navigate = useNavigate();

    const [objToData, setObjToData] = useState({ debt: 0 });
    const [showMessage, setShowMessage] = useState(false);
    const [formData, setFormData] = useState({});

    const toast = useRef(null);
    const buttonEl = useRef(null);
    const [visible, setVisible] = useState(false);

    const [selectedDrop, setSelectedDrop] = useState(null);
    const [selectedDropEntry, setSelectedDropEntry] = useState(null);
    const [filteredEntries, setFilteredEntries] = useState(null);

    const [entries, setEntries] = useState(null);
    const dataForDrop = ["כן", "לא"];

    const searchEntry = (event) => {
        let query = event.query;
        let _filteredApartmens = [];

        for (let i = 0; i < entries.length; i++) {
            const entry = entries[i];
            if (entry.nickname.indexOf(query) === 0) {
                _filteredApartmens.push(entry);
            }
        }
        setFilteredEntries(_filteredApartmens);
    }

    const getEntries = async () => {
        const data = await fetchData(`entry?building_id=${tenant?.building_id}`);
        if (data) {
            setEntries(data);
        }
    }

    useEffect(() => {
        getEntries();
    }, [])

    const handleChange = async (selected, key) => {
        setObjToData((prev) => ({ ...prev, [key]: selected }));
    }

    const accept = async () => {
        if (objToData.floor > selectedDropEntry?.floor)
            toast.current.show({ severity: 'error', detail: 'מספר הקומה שהגדרת אינו מוגדר בבניין שלך', life: 3000 });
        else {
            const res = await postData(`apartment`, objToData);
            setShowMessage(true);
            if (res == 200 || res == 201)
                toast.current.show({ severity: 'success', detail: 'הדירה נוצרה בהצלחה, סיסמא תשלח לאימייל שהוזן', life: 3000 });
            else
                toast.current.show({ severity: 'error', detail: 'פרטי הדירה לא נשמרו, ישנם פרטים חסרים', life: 3000 });
        }
    };

    const reject = () => {
        toast.current.show({ severity: 'warn', detail: 'פרטי הדירה לא נשמרו', life: 3000 });
    };

    const onSubmit = (data, form) => {
        setFormData(data);
        // setShowMessage(true);
        setVisible(true);
        // form.restart();
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="למעבר להגדרת דייר" className="p-button-text" autoFocus onClick={() => { setShowMessage(false); navigate('/addTenant'); }} /></div>;

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" showHeader={false} footer={dialogFooter} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    <h5>הדירה נוספה בהצלחה</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        כעת תועבר/י ליצירת הדייר הראשון בדירה שיהיה
                        .איש הקשר שלה מול וועד הבית של הבניין שלך
                    </p>
                </div>
            </Dialog>

            <div className="flex justify-content-center">
                <div className="card">
                    <Card title="הוספת דירה">
                        <Form onSubmit={onSubmit} initialValues={{ floor: "", entry: "", number: "", rooms: "" }} render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit} className="p-fluid">
                                <Field name="entry" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <AutoComplete
                                                id='entry'
                                                value={selectedDropEntry}
                                                suggestions={filteredEntries}
                                                completeMethod={searchEntry}
                                                virtualScrollerOptions={{ itemSize: 38 }}
                                                field="nickname"
                                                dropdown
                                                onChange={(e) => {
                                                    setSelectedDropEntry(e.value)
                                                    handleChange(e.value.id, "entry_id")
                                                }}
                                                style={{ direction: "ltr" }}
                                            />
                                            <label htmlFor="entry" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*כניסה</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="floor" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputNumber inputId="minmax-buttons" onValueChange={e => handleChange(e.target.value, "floor")} mode="decimal" />
                                            <label htmlFor="floor" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר קומה</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="number" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="number" onChange={e => handleChange(e.target.value, "description")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="number" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר דירה</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />
                                <Field name="rooms" render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="p-float-label">
                                            <InputText id="rooms" onChange={e => handleChange(e.target.value, "num_of_rooms")} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                            <label htmlFor="rooms" className={classNames({ 'p-error': isFormFieldValid(meta) })}>*מספר חדרים בדירה</label>
                                        </span>
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )} />

                                <Toast ref={toast} />
                                <ConfirmPopup target={buttonEl.current} visible={visible} onHide={() => setVisible(false)}
                                    message="האם הנך בטוח/ה שברצונך להוסיף דירה חדש/ה" icon="pi pi-exclamation-triangle" accept={accept} reject={reject} />
                                <div className="card flex justify-content-center">
                                    <Button type="submit" label="הוספת הדירה" className="mt-2" icon="pi pi-home" style={{ minWidth: "100%", direction: "ltr" }} />
                                </div>
                            </form>
                        )} />
                    </Card>
                </div>
            </div>
        </div>
    );
}