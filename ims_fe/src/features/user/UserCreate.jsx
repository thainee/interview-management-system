import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import Container from 'react-bootstrap/Container';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import '../../assets/css/styles.css';
import Select from 'react-select';
import { departmentOptions, genderOptions, userStatusOptions, userRoleOptions } from '../../utils/optionUtils';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import {createNewUser} from "../../store/usersSlice";


const UserCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const createSelectStyles = useCallback((touched, errors, submitted, fieldName) => ({
        control: (base) => ({
            ...base,
            borderColor: (touched[fieldName] || submitted) && errors[fieldName]
                ? '#dc3545'  // Invalid state color
                : (touched[fieldName] || submitted) && !errors[fieldName]
                    ? '#198754'  // Valid state color
                    : base.borderColor,  // Default state color
        }),
    }), []);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(setPageInfo({ pageName: 'User', moduleName: 'User', moduleLink: 'users', submoduleName: 'Create User' }));
    }, [dispatch]);

    const schema = yup.object().shape({
        fullName: yup.string().required('Full name is required'),
        email: yup.string()
            .email('Invalid email')
            .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, 'Email must be in the format: example@domain.com')
            .required('Email is required'),
        dob: yup.date().max(new Date(), 'Date of Birth must be in the past').required('D.O.B is required'),
        address: yup.string().required('Address is required'),
            phoneNumber: yup.string()
                .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
                .required('Phone number is required'),
        gender: yup.string().required('Gender is required'),
        role: yup.string().required('Role is required'),
        department: yup.string().required('Department is required'),
        status: yup.string().required('Status is required'),
        note: yup.string().max(500, 'Note must not exceed 500 characters')
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        // Convert the skills array to a string array of skill values

        // Create a new object with the correct structure
        const userData = {
            fullName: values.fullName,
            email: values.email,
            dob: values.dob,
            address: values.address,
            phoneNumber: values.phoneNumber,
            gender: values.gender,
            role: values.role,
            department: values.department,
            status: values.status,
            note: values.note
        };


        try {
            await dispatch(createNewUser(userData)).unwrap();
            dispatch(setToast({ type: 'success', message: 'User created successfully!' }));
            navigate('/users'); // Assuming you have a function like navigate from a routing library
        } catch (error) {
            dispatch(setToast({ type: 'error', message: error.message}));
            setErrors({ submit: error.message || 'An error occurred while creating the user.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <BreadcrumbComponent />
            <div className='p-4 bg-white rounded-3'>
                <Formik
                    validateOnChange
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                    initialValues={{
                        fullName: '',
                        email: '',
                        dob: '',
                        address: '',
                        phoneNumber: '',
                        gender: '',
                        role: '',
                        department: '',
                        status: 'ACTIVE',
                        note: 'N/A',
                    }}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        setFieldValue,
                        values,
                        touched,
                        errors,
                        isSubmitting = false
                    }) => {
                        return (
                            <Form noValidate onSubmit={handleSubmit}>
                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik01">
                                        <Form.Label>Full name <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            placeholder={"Type a name..."}
                                            type="text"
                                            name="fullName"
                                            value={values.fullName}
                                            onChange={handleChange}
                                            isValid={(touched.fullName || submitted) && !errors.fullName}
                                            isInvalid={(touched.fullName || submitted) && !!errors.fullName}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.fullName}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik02">
                                        <Form.Label>Email <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            placeholder={"Type an email..."}
                                            type="email"
                                            name="email"
                                            value={values.email}
                                            onChange={handleChange}
                                            isValid={(touched.email || submitted) && !errors.email}
                                            isInvalid={(touched.email || submitted) && !!errors.email}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik03">
                                        <Form.Label>D.O.B <span className="requiredSpan">*</span></Form.Label>
                                        <DatePicker
                                            selected={values.dob}
                                            onChange={(date) => setFieldValue('dob', date)}
                                            placeholderText='DD/MM/YYYY'
                                            dateFormat="dd/MM/yyyy"
                                            customInput={
                                                <Form.Control isValid={(touched.dob || submitted) && !errors.dob}
                                                              isInvalid={(touched.dob || submitted) && !!errors.dob} />
                                            }
                                            wrapperClassName="w-100"
                                            className="react-datepicker-popper"
                                            position="fixed"
                                        />
                                        {(touched.dob || submitted) && errors.dob && (
                                            <div className="invalid-feedback d-block">{errors.dob}</div>
                                        )}
                                        <Form.Control.Feedback type="invalid">{errors.dob}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik04">
                                        <Form.Label>Address <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            placeholder={"Type an address..."}
                                            type="text"
                                            name="address"
                                            value={values.address}
                                            onChange={handleChange}
                                            isValid={(touched.address || submitted) && !errors.address}
                                            isInvalid={(touched.address || submitted) && !!errors.address}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                                    </Form.Group>
                                </Row>
                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik05">
                                        <Form.Label>Phone number <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            placeholder={"Type a number..."}
                                            type="text"
                                            name="phoneNumber"
                                            value={values.phoneNumber}
                                            onChange={handleChange}
                                            isValid={(touched.phoneNumber || submitted) && !errors.phoneNumber}
                                            isInvalid={(touched.phoneNumber || submitted) && !!errors.phoneNumber}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.phoneNumber}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik06">
                                        <Form.Label>Gender <span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            placeholder={"Select a gender"}
                                            name="gender"
                                            options={genderOptions}
                                            value={genderOptions.find(option => option.value === values.gender)}
                                            onChange={(selectedOption) => setFieldValue('gender', selectedOption.value)}
                                            styles={createSelectStyles(touched, errors, submitted, "gender")}
                                        />
                                        {(touched.gender || submitted) && errors.gender && (
                                            <div className="invalid-feedback d-block">{errors.gender}</div>
                                        )}
                                    </Form.Group>
                                </Row>
                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik07">
                                        <Form.Label>Roles <span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            placeholder="Select a position... ex. Backend developer,..."
                                            name="role"
                                            options={userRoleOptions}
                                            value={userRoleOptions.find(option => option.value === values.role)}
                                            onChange={(selectedOption) => setFieldValue('role', selectedOption.value)}
                                            styles={createSelectStyles(touched, errors, submitted, "role")}
                                            filterOption={(option, inputValue) =>{
                                                return option.value !== userRoleOptions[0].value;
                                            }
                                        }
                                        />
                                        {(touched.role || submitted) && errors.role && (
                                            <div className="invalid-feedback d-block">{errors.role}</div>
                                        )}
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik08">
                                        <Form.Label>Department <span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            placeholder="Type a department"
                                            name="department"
                                            options={departmentOptions}
                                            value={departmentOptions.find(option => option.value === values.department)}
                                            onChange={(selectedOption) => setFieldValue('department', selectedOption.value)}
                                            styles={createSelectStyles(touched, errors, submitted, "department")}
                                            filterOption={(option, inputValue) =>{
                                                return option.value !== departmentOptions[0].value;
                                            }
                                        }
                                        />
                                        {(touched.department || submitted) && errors.department && (
                                            <div className="invalid-feedback d-block">{errors.department}</div>
                                        )}
                                    </Form.Group>
                                </Row>
                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik09">
                                        <Form.Label>Status <span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            name="status"
                                            options={userStatusOptions}
                                            value={userStatusOptions.find(option => option.value === values.status)}
                                            onChange={(selectedOption) => setFieldValue('status', selectedOption.value)}
                                            styles={createSelectStyles(touched, errors, submitted, "status")}
                                            defaultValue={userStatusOptions.find(option => option.value === 'ACTIVE')}
                                        />
                                        {(touched.status || submitted) && errors.status && (
                                            <div className="invalid-feedback d-block">{errors.status}</div>
                                        )}
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik13">
                                        <Form.Label>Note</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="note"
                                            value={values.note}
                                            onChange={handleChange}
                                            isInvalid={!!errors.note}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.note}</Form.Control.Feedback>
                                        <Form.Text muted>
                                            {values.note.length}/500 characters
                                        </Form.Text>
                                    </Form.Group>
                                </Row>
                                <div className='d-flex justify-content-center align-items-center'>
                                    <Button type="submit" onClick={() => setSubmitted(true)} disabled={isSubmitting}>
                                        Submit
                                    </Button>
                                    <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
                                        Cancel
                                    </Button>
                                </div>
                            </Form>
                        )
                    }}
                </Formik>
            </div>
        </Container>
    );
}

export default UserCreate;