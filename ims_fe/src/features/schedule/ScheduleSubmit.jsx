import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Formik } from 'formik';
import * as yup from 'yup';
import Select from 'react-select';
import '../../assets/css/styles.css';
import { getScheduleById, submitScheduleById } from '../../store/scheduleSlice';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { scheduleResultOptions } from '../../utils/optionUtils';

const ScheduleSubmit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const schedule = useSelector((state) => state.schedules.currentSchedule);
    const status = useSelector((state) => state.schedules.status);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        dispatch(setPageInfo({ pageName: 'Interview Schedules', moduleName: 'Schedule', moduleLink: 'schedules', submoduleName: 'Edit Schedule' }));
        dispatch(getScheduleById(id));
    }, [dispatch, id]);

    const createSelectStyles = useCallback((touched, errors, submitted, fieldName) => ({
        control: (base) => ({
            ...base,
            borderColor: (touched[fieldName] || submitted) && errors[fieldName]
                ? '#dc3545'
                : (touched[fieldName] || submitted) && !errors[fieldName]
                    ? '#198754'
                    : base.borderColor,
        }),
    }), []);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error loading schedule</div>;
    }

    if (!schedule) {
        return <div>No schedule found</div>;
    }



    const schema = yup.object().shape({
        note: yup.string().max(500, 'Note must not exceed 500 characters'),
        result: yup.string().oneOf(scheduleResultOptions.map((option) => option.value)).required('Result are required'),
        status: yup.string(),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        const scheduleData = {
            id: id,
            ...schedule,
            note: values.note,
            result: values.result,
            status: values.status,
        };

        try {
            await dispatch(submitScheduleById(scheduleData)).unwrap();
            dispatch(setToast({ type: 'success', message: 'Schedule updated successfully!' }));
            navigate('/schedules');
        } catch (error) {
            dispatch(setToast({ type: 'error', message: 'Failed to update schedule.' }));
            setErrors({ submit: error.message || 'An error occurred while updating the schedule.' });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container>
            <BreadcrumbComponent as={Col} xs={8} />
            <div className='p-4 bg-white rounded-3'>
                <Formik
                    validateOnChange
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                    initialValues={{
                        note: schedule.note || '',
                        result: schedule.result || '',
                        status: 'CLOSED',
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
                    }) => (
                        <Form noValidate onSubmit={handleSubmit}>
                            <Row className="form-row">
                                <Form.Group as={Col} md="6" controlId="validationFormik01">
                                    <Form.Label>Schedule title</Form.Label>
                                    <Form.Control
                                        value={schedule.title}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="validationFormik12">
                                    <Form.Label>Job</Form.Label>
                                    <Form.Control
                                        value={schedule.jobTitle}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="form-row">
                                <Form.Group as={Col} md="6" controlId="validationFormik03">
                                    <Form.Label>Candidate name</Form.Label>
                                    <Form.Control
                                        value={schedule.candidateName}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="validationFormik04">
                                    <Form.Label>Interviewer</Form.Label>
                                    <Form.Control
                                        value={schedule.interviewers.map(i => i.userName).join(', ')}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="form-row">
                                <Form.Group as={Col} md="6" controlId="validationFormik05">
                                    <Form.Label>Interview Date</Form.Label>
                                    <Form.Control
                                        value={format(new Date(schedule.interviewDate), "dd/MM/yyyy")}
                                        readOnly
                                    />
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="validationFormik06">
                                    <Form.Label>Location</Form.Label>
                                    <Form.Control
                                        value={schedule.location}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="form-row">
                                <Form.Group as={Col} md="3" controlId="validationFormik07">
                                    <Form.Label>From</Form.Label>
                                    <Form.Control
                                        value={format(new Date(schedule.startTime), "HH:mm")}
                                        readOnly
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md="3" controlId="validationFormik08">
                                    <Form.Label>To</Form.Label>
                                    <Form.Control
                                        value={format(new Date(schedule.endTime), "HH:mm")}
                                        readOnly
                                    />
                                </Form.Group>

                                <Form.Group as={Col} md="6" controlId="validationFormik09">
                                    <Form.Label>Recruiter owner</Form.Label>
                                    <Form.Control
                                        value={schedule.recruiterName}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>

                            <Row className="form-row">
                                <Form.Group as={Col} md="6" controlId="validationFormik10">
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

                                <Form.Group as={Col} md="6" controlId="validationFormik11">
                                    <Form.Label>Result</Form.Label>
                                    <Select
                                        placeholder="result"
                                        name="result"
                                        options={scheduleResultOptions}
                                        value={scheduleResultOptions.find(option => option.value === values.result)}
                                        onChange={(selectedOption) => setFieldValue('result', selectedOption.value)}
                                        styles={createSelectStyles(touched, errors, submitted, "result")}
                                    />
                                    {(touched.result || submitted) && errors.result && (
                                        <div className="invalid-feedback d-block">{errors.result}</div>
                                    )}
                                </Form.Group>
                            </Row>

                            <Row className="form-row">
                                <Form.Group as={Col} md="6" controlId="validationFormik13">
                                </Form.Group>
                                <Form.Group as={Col} md="6" controlId="validationFormik13">
                                    <Form.Label>Meeting ID</Form.Label>
                                    <Form.Control
                                        value={schedule.meetingLink}
                                        readOnly
                                    />
                                </Form.Group>
                            </Row>

                            <div className='d-flex justify-content-center align-items-center mt-3'>
                                <Button type="submit" onClick={() => setSubmitted(true)} disabled={isSubmitting}>
                                    Submit
                                </Button>
                                <Button variant="secondary" className="ms-2" onClick={() => navigate('/schedules')}>
                                    Cancel
                                </Button>
                            </div>
                        </Form>
                    )}
                </Formik>
            </div>
        </Container>
    );
}

export default ScheduleSubmit;