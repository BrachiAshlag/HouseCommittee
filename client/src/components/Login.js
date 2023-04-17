
import React, { useRef } from "react";
import { useFormik } from 'formik';
import { InputText } from "primereact/inputtext";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { classNames } from 'primereact/utils';
import { Card } from "primereact/card";
import { Password } from 'primereact/password';
import { useNavigate } from "react-router-dom"


export default function Login() {
    const toast = useRef(null);
    const navigate = useNavigate();

    const show = () => {
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: formik.values.buildingId });
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: formik.values.userId });
        toast.current.show({ severity: 'success', summary: 'Form Submitted', detail: formik.values.password });
    };

    const formik = useFormik({
        initialValues: {
            buildingId: "",
            userId: "",
            password: ""
        },
        validate: (data) => {
            let errors = {};

            if (!data.buildingId) {
                errors.buildingId = 'קוד בניין נדרש';
            }
            if (!data.userId) {
                errors.userId = 'קוד משתמש נדרש';
            }
            if (!data.password) {
                errors.password = 'סיסמא נדרשת';
            }
            return errors;
        },
        onSubmit: (data) => {
            data && show(data);
            formik.resetForm();
        }
    });

    const isFormFieldInvalid = (name) => !!(formik.touched[name] && formik.errors[name]);

    const getFormErrorMessage = (name) => {
        return isFormFieldInvalid(name) ? <small className="p-error">{formik.errors[name]}</small> : <small className="p-error">&nbsp;</small>;
    };

    return (
        <div className="card flex justify-content-center">
            <Card style={{ width: "30%", margin: "5%" }} title="כניסה למערכת ">
                <div className="card flex justify-content-center">
                    <form onSubmit={formik.handleSubmit} className="flex flex-column gap-2">
                        <span className="p-float-label">
                            <Toast ref={toast} />
                            <InputText
                                id="buildingId"
                                name="buildingId"
                                value={formik.values.buildingId}
                                onChange={(e) => {
                                    formik.setFieldValue('buildingId', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('buildingId') })}
                                style={{ width:"100%" }}
                            />
                            <label htmlFor="input_value">קוד בניין</label>
                        </span>
                        {getFormErrorMessage('buildingId')}

                        <span className="p-float-label">
                            <Toast ref={toast} />
                            <InputText
                                id="userId"
                                name="userId"
                                value={formik.values.userId}
                                onChange={(e) => {
                                    formik.setFieldValue('userId', e.target.value);
                                }}
                                className={classNames({ 'p-invalid': isFormFieldInvalid('userId') })}
                                style={{ width:"100%" }}
                            />
                            <label htmlFor="input_value">קוד משתמש</label>
                        </span>
                        {getFormErrorMessage('userId')}

                        <span className="p-float-label">
                            <Toast ref={toast} />
                            <Password
                                id="password"
                                name="password"
                                value={formik.values.password}
                                onChange={(e) => formik.setFieldValue('password', e.target.value)}
                                toggleMask
                                className={classNames({ 'p-invalid': isFormFieldInvalid('password') })}
                                feedback= {false}
                            />

                            <label htmlFor="input_value">סיסמא</label>
                        </span>
                        {getFormErrorMessage('password')}
                        <Button type="submit" label="כניסה" icon="pi pi-user"/>
                    </form>
                </div><br/>           
                <small id="forget" className="card flex justify-content-center" onClick={()=> navigate("/")}>
                    שכחתי סיסמא
                </small>               
            </Card>
            
        </div>
    )
}

