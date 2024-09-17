import React, { useState } from 'react';
import { Formik } from 'formik';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import "react-datepicker/dist/react-datepicker.css";
import styles from './GenericForm.module.css';
import { useNavigate } from 'react-router-dom';
import useUserScope from '../../hooks/useUserScope';

const GenericForm = ({
    initialValues,
    validationSchema,
    onSubmit,
    fields,
    subtitle,
    breadcrumbItems,
    onAssignMe,
    onCandidateChange
}) => {
    const [submitted, setSubmitted] = useState(false);
    const navigate = useNavigate();
    
    const renderField = (field, values, errors, touched, handleChange, setFieldValue) => {
        switch (field.type) {
            case 'text':
            case 'email':
            case 'number':
                return (
                    <Form.Control
                        type={field.type}
                        name={field.name}
                        value={values[field.name]}
                        onChange={handleChange}
                        isValid={(touched[field.name] || submitted) && !errors[field.name]}
                        isInvalid={(touched[field.name] || submitted) && !!errors[field.name]}
                    />
                );
            case 'select':
                return (
                    <Select
                        name={field.name}
                        options={field.options}
                        value={field.options.find(option => option.value === values[field.name])}
                        onChange={(selectedOption) => {
                            setFieldValue(field.name, selectedOption.value);
                            if (field.name === 'candidateId' && onCandidateChange) {
                                onCandidateChange(selectedOption.value, setFieldValue);
                            }
                        }}
                        styles={createSelectStyles(touched, errors, submitted, field.name)}
                    />
                );
            case 'multiSelect':
                return (
                    <Select
                        isMulti
                        name={field.name}
                        options={field.options}
                        value={values[field.name]}
                        onChange={(selectedOptions) => setFieldValue(field.name, selectedOptions)}
                        styles={createSelectStyles(touched, errors, submitted, field.name)}
                    />
                );
            case 'date':
                return (
                    <DatePicker
                        selected={values[field.name]}
                        onChange={(date) => setFieldValue(field.name, date)}
                        placeholderText='dd/MM/yyyy'
                        dateFormat="dd/MM/yyyy"
                        customInput={
                            <Form.Control
                                isValid={(touched[field.name] || submitted) && !errors[field.name]}
                                isInvalid={(touched[field.name] || submitted) && !!errors[field.name]}
                            />
                        }
                        wrapperClassName="w-100"
                    />
                );
            case 'file':
                return (
                    <Form.Control
                        type="file"
                        name={field.name}
                        onChange={(event) => setFieldValue(field.name, event.currentTarget.files[0])}
                        isValid={(touched[field.name] || submitted) && !errors[field.name]}
                        isInvalid={(touched[field.name] || submitted) && !!errors[field.name]}
                    />
                );
            case 'textarea':
                return (
                    <>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            name={field.name}
                            value={values[field.name]}
                            onChange={handleChange}
                            isInvalid={!!errors[field.name]}
                        />
                        <Form.Text muted>
                            {values[field.name].length}/500 characters
                        </Form.Text>
                    </>
                );
            case 'disabledTextarea':
                return (
                    <>
                        <Form.Control
                            as="textarea"
                            name={field.name}
                            value={values[field.name]}
                            disabled
                        />
                    </>
                );
            case 'disabled':
                return (
                    <>
                        <Form.Control
                            name={field.name}
                            value={values[field.name]}
                            disabled
                        />
                    </>
                );
            default:
                return null;
        }
    };

    const createSelectStyles = (touched, errors, submitted, fieldName) => ({
        control: (base) => ({
            ...base,
            borderColor: (touched[fieldName] || submitted) && errors[fieldName]
                ? '#dc3545'
                : (touched[fieldName] || submitted) && !errors[fieldName]
                    ? '#198754'
                    : base.borderColor,
        }),
    });

    const userScope = useUserScope();

    const actionPermissions = {
        assignMe: ['RECRUITER']
    };

    const hasPermission = (userScope, action) => {
        return actionPermissions[action].includes(userScope);
    };
    return (
        <Container>
            <BreadcrumbComponent items={breadcrumbItems} />
            <div className={styles.formContainer}>
                {subtitle && <h6 className={styles.subtitle}>{subtitle}</h6>}
                <Formik
                    initialValues={initialValues}
                    validationSchema={validationSchema}
                    onSubmit={(values, { setSubmitting }) => {
                        onSubmit(values, setSubmitting);
                    }}
                >
                    {({
                        handleSubmit,
                        handleChange,
                        setFieldValue,
                        values,
                        touched,
                        errors,
                        isSubmitting,
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            {fields.map((fieldGroup, index) => (
                                <React.Fragment key={index}>
                                    {fieldGroup.title && <h6 className={styles.sectionTitle}>{fieldGroup.title}</h6>}
                                    <Row className={styles.formRow}>
                                        {fieldGroup.fields.map((field) => (
                                            <Form.Group as={Col} md="6" key={field.name} controlId={`validation${field.name}`} className={styles.fieldGroup}>
                                                <Form.Label>{field.label} {field.required && <span className={styles.requiredSpan}>*</span>}</Form.Label>
                                                {renderField(field, values, errors, touched, handleChange, setFieldValue)}
                                                {(touched[field.name] || submitted) && errors[field.name] && (
                                                    <div className={styles.invalidFeedback}>{errors[field.name]}</div>
                                                )}
                                                {hasPermission(userScope,'assignMe') && field.name === 'recruiterId' && (
                                                    <Button
                                                        variant="link"
                                                        className="mt-2"
                                                        onClick={() => onAssignMe(setFieldValue)}
                                                    >
                                                        Assign me
                                                    </Button>
                                                )}
                                            </Form.Group>
                                        ))}
                                    </Row>
                                </React.Fragment>
                            ))}
                            <div className={styles.buttonContainer}>
                                <Button type="submit" onClick={() => setSubmitted(true)} disabled={isSubmitting}>
                                    {isSubmitting ? 'Submitting...' : 'Submit'}
                                </Button>
                                <Button variant="secondary" className={styles.cancelButton} onClick={() => navigate(-1)}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
};

export default GenericForm;