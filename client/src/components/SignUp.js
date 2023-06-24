import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Checkbox } from 'primereact/checkbox';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { useSignUp } from '../../Hooks/usePostAxios';
import './signup.css';

export default function SignUpStudents(props) {
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showMessage, setShowMessage] = useState(false);
    const [message, setMessage] = useState(<></>);
    const [formData, setFormData] = useState({});

    const validate = (data) => {
        let errors = {};
        if (!data.firstName) {
            errors.firstName = 'First Name is required.';
        }
        if (!data.lastName) {
            errors.lastName = 'Last Name is required.';
        }
        if (!data.email) {
            errors.email = 'Email is required.';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = 'Invalid email address. E.g. example@email.com';
        }
        if (!data.password) {
            errors.password = 'Password is required.';
        }
        else if (data.password.length < 8 || data.password.length > 12) {
            errors.password = 'Password length is at least 8 and at most 12.';
        }
        if (!data.idNumber) {
            errors.idNumber = 'ID number is required.';
        }
        else if (data.idNumber.length !== 9 || !/^\d+$/.test(data.idNumber)) {
            errors.idNumber = 'ID Number is invalid.'
        }
        if (!data.accept) {
            errors.accept = 'You need to agree to the terms and conditions.';
        }
        return errors;
    };

    const onSubmit = async (data, form) => {
        setFormData(data);
        form.restart();
        await HandleClick(data);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const dialogFooter = <div className="flex justify-content-center"><Button label="OK" className="p-button-text" autoFocus onClick={() => { setShowMessage(false); navigate('/sign-in'); }} /></div>;
    const errorDialodFooter = <div className='flex justify-content-center'><Button label='OK' className='p-button-text' autoFocus onClick={() => { setShowErrorMessage(false); navigate('/sign-in') }} /></div>;
    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>At least one lowercase</li>
                <li>At least one uppercase</li>
                <li>At least one numeric</li>
                <li>Minimum 8 characters</li>
            </ul>
        </React.Fragment>
    );
    const navigate = useNavigate();
    async function HandleClick(data) {
        const obj = {
            firstName: data.firstName,
            lastName: data.lastName,
            idNumber: data.idNumber,
            email: data.email,
            password: data.password,
            image: data.image
        }
        const res = await useSignUp('students', obj);
        console.log(res);
        if (res.status && res.status === 201) {
            localStorage.setItem('token', JSON.stringify(res.data.accessToken));
            localStorage.setItem('studentInfo', JSON.stringify(res.data.data));
            setMessage(<>
                <h5>Registration Successful!</h5>
                <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                    Your account is registered under name <b>{data.firstName} {data.lastName}</b>.<br />Please check <b>{data.email}</b> for activation instructions.
                </p>
            </>)
            setShowMessage(true);
        }
        else if (res.status && res.status === 200) {
            setMessage(<>
                <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>There are duplicate students.<br />Instead, you can try to sign in.</p>
            </>)
            setShowErrorMessage(true);
        }
        // why - ??? it still does not work out.
        else if (res.response && res.response.data.message === 'Duplicate student') {
            setMessage(<>
                <h5>You Are Signed Up already!</h5>
            </>)
        }
        else {
            setErrorMessage(res.message);
            setShowErrorMessage(true);
        }
    };

    return (
        <div className="form-demo">
            <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                    {message}
                </div>
            </Dialog>
            <Dialog visible={showErrorMessage} onHide={() => setShowErrorMessage(false)} position="top" footer={errorDialodFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                <div className="flex align-items-center flex-column pt-6 px-3">
                    <i className="pi pi-undo" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                    <h5>Failed Registration</h5>
                    <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
                        {message}
                    </p>
                </div>
            </Dialog>
            <div className="flex justify-content-center">
                <div className="card">
                    <h4 className="text-center">Sign Up Student</h4>
                    <Form onSubmit={onSubmit} initialValues={{ firstName: '', lastName: '', email: '', password: '', idNumber: '', accept: false }} validate={validate} render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit} className="p-fluid">
                            <Field name="firstName" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="firstName" {...input} autoFocus className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="firstName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>FirstName*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="lastName" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="lastName" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="lastName" className={classNames({ 'p-error': isFormFieldValid(meta) })}>lastName*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="idNumber" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <InputText id="ID number" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="ID number" className={classNames({ 'p-error': isFormFieldValid(meta) })}>ID number*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="email" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label p-input-icon-right">
                                        <i className="pi pi-envelope" />
                                        <InputText id="email" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                        <label htmlFor="email" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Email*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />
                            <Field name="password" render={({ input, meta }) => (
                                <div className="field">
                                    <span className="p-float-label">
                                        <Password id="password" {...input} toggleMask className={classNames({ 'p-invalid': isFormFieldValid(meta) })} header={passwordHeader} footer={passwordFooter} />
                                        <label htmlFor="password" className={classNames({ 'p-error': isFormFieldValid(meta) })}>Password*</label>
                                    </span>
                                    {getFormErrorMessage(meta)}
                                </div>
                            )} />

                            <Field name="accept" type="checkbox" render={({ input, meta }) => (
                                <div className="field-checkbox">
                                    <Checkbox inputId="accept" {...input} className={classNames({ 'p-invalid': isFormFieldValid(meta) })} />
                                    <label htmlFor="accept" className={classNames({ 'p-error': isFormFieldValid(meta) })}>I agree to the terms and conditions*</label>
                                </div>
                            )} />
                            <Button type="submit" label="Sign Up" className="mt-2" />
                        </form>
                    )} />
                </div>
            </div>
        </div>
    );
}