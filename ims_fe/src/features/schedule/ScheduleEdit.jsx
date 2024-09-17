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
import '../../assets/css/styles.css';
import { getInterviewers, getScheduleById, updateScheduleById } from '../../store/scheduleSlice';
import { getJobs } from '../../store/jobsSlice';
import Select from 'react-select';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, parse, setHours, setMinutes } from 'date-fns';
import ActionModal from '../../commons/ActionModal/ActionModal';
import Loading from '../../commons/Loading/Loading';
//import useUserScope from '../../hooks/useUserScope';
import { jwtDecode } from 'jwt-decode';
import { useRecruiterOptions } from '../../hooks/useRecruiterOptions';


const ScheduleEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const jobsState = useSelector((state) => state.jobs);
    const schedule = useSelector((state) => state.schedules.currentSchedule);
    const scheduleInterviewers = useSelector((state) => state.schedules.scheduleInterviewers);
    const status = useSelector((state) => state.schedules.status);
    const [submitted, setSubmitted] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    //const userScope = useUserScope();

    const actionPermissions = {
        cancelSchedule: ['RECRUITER', 'MANAGER', 'ADMIN'],
        assign: ['RECRUITER']
    };

    const { userId: currentUserId } = jwtDecode(localStorage.getItem('token'));

    const { scope: userScope } = jwtDecode(localStorage.getItem('token'));

    const { recruiterOptions, isLoading } = useRecruiterOptions();

    const hasPermission = (userScope, action) => {
        return actionPermissions[action].includes(userScope);
    };

    const extractUsername = (fullNameWithUsername) => {
        const match = fullNameWithUsername.match(/\(([^)]+)\)/);
        return match ? match[1] : fullNameWithUsername;
    };

    const extractFullname = (fullNameWithId) => {
        const match = fullNameWithId.match(/(.*?)\s*\(\d+\)/);
        return match ? match[1].trim() : fullNameWithId;
    };


    useEffect(() => {
        dispatch(setPageInfo({ pageName: 'Interview Schedules', moduleName: 'Schedule', moduleLink: 'schedules', submoduleName: 'Edit Schedule' }));
        dispatch(getScheduleById(id));
        dispatch(getInterviewers());
        dispatch(getJobs({ page: 1, size: 10, searchTerm: '', status: 'OPEN' }));
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

    if (status === 'loading') return <Loading />;

    if (status === 'failed') {
        return <div>Error loading schedule</div>;
    }

    if (!schedule) {
        return <div>No schedule found</div>;
    }

    const jobOptions = jobsState.list.map(job => ({
        value: job.id.toString(),
        label: job.title
    }));

    const interviewerOptions = scheduleInterviewers.map(interviewer => ({
        value: interviewer.id,
        label: interviewer.userName
    }));

    const handleConfirmCancel = async () => {
        try {
            const cancelledSchedule = {
                id: id,
                ...schedule,
                status: 'CANCELLED'
            };
            await dispatch(updateScheduleById(cancelledSchedule)).unwrap();
            dispatch(setToast({ type: 'success', message: 'Schedule cancelled successfully!' }));
            navigate('/schedules');
        } catch (error) {
            dispatch(setToast({ type: 'error', message: 'Failed to cancel schedule.' }));
        } finally {
            setShowCancelModal(false);
        }
    };

    console.log(schedule.interviewDate)

    const schema = yup.object().shape({
        title: yup.string().required('Schedule title is required'),
        candidateName: yup.string().required('Candidate name is required'),
        interviewDate: yup.date().min(
            new Date(new Date().setHours(0, 0, 0, 0)),
            'Interview date must be or after current date'
        ).required('Interview date is required'),
        startTime: yup.string().required('Start time is required'),
        endTime: yup.string()
            .required('End time is required')
            .test('is-greater', 'End time should be greater than start time', function (value) {
                const { startTime } = this.parent;
                return !startTime || !value || value > startTime;
            }),
        note: yup.string().max(500, 'Note must not exceed 500 characters'),
        jobTitle: yup.string().required('Job is required'),
        interviewers: yup.array().min(1, 'At least one interviewer is required').required('Interviewers are required'),
        location: yup.string().max(500, 'Location not exceed 500 characters'),
        recruiterName: yup.string().required('Recruiter is required'),
        meetingLink: yup.string().max(500, 'Link must not exceed 500 characters'),
        result: yup.string(),
        status: yup.string(),
    });

    const handleSubmit = async (values, { setSubmitting, setErrors }) => {
        const interviewDate = new Date(values.interviewDate);
        const startTime = parse(values.startTime, 'HH:mm', new Date());
        const endTime = parse(values.endTime, 'HH:mm', new Date());


        const scheduleData = {
            id: id,
            title: values.title,
            jobTitle: values.jobTitle,
            candidateName: values.candidateName,
            interviewers: values.interviewers.map(interviewer => ({ userName: interviewer.label })),
            recruiterName: values.recruiterName,
            interviewDate: format(interviewDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            startTime: format(setHours(setMinutes(new Date(0), startTime.getMinutes()), startTime.getHours()), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            endTime: format(setHours(setMinutes(new Date(0), endTime.getMinutes()), endTime.getHours()), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
            result: values.result || "",
            location: values.location,
            note: values.note,
            meetingLink: values.meetingLink,
            status: values.status
        };

        try {
            await dispatch(updateScheduleById(scheduleData)).unwrap();
            dispatch(setToast({ type: 'success', message: 'Schedule updated successfully!' }));
            navigate('/schedules');
        } catch (error) {
            dispatch(setToast({ type: 'error', message: 'Failed to update schedule.' }));
            setErrors({ submit: error.message || error });
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
                        id: schedule.id,
                        title: schedule.title,
                        candidateName: schedule.candidateName,
                        interviewDate: new Date(schedule.interviewDate),
                        startTime: format(new Date(schedule.startTime), "HH:mm"),
                        endTime: format(new Date(schedule.endTime), "HH:mm"),
                        note: schedule.note,
                        jobTitle: schedule.jobTitle,
                        interviewers: schedule.interviewers.map(interviewer => ({
                            value: interviewer.id,
                            label: interviewer.userName
                        })),
                        location: schedule.location,
                        recruiterName: schedule.recruiterName,
                        meetingLink: schedule.meetingLink,
                        result: schedule.result || "",
                        status: schedule.status,
                    }}>
                    {({
                        handleSubmit,
                        handleChange,
                        setFieldValue,
                        values,
                        touched,
                        errors,
                        isSubmitting
                    }) => {
                        const handleAssignMe = () => {
                            const currentUserOption = recruiterOptions.find(option => option.value === currentUserId);
                            if (currentUserOption) {
                                setFieldValue('recruiterName', extractUsername(currentUserOption.label));
                            }
                        };

                        return (
                            <Form noValidate onSubmit={handleSubmit}>

                                {hasPermission(userScope, 'cancelSchedule') && (
                                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                        <Button variant="info" onClick={() => setShowCancelModal(true)}>
                                            Cancel schedule
                                        </Button>
                                    </div>
                                )}
                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik01">
                                        <Form.Label>Schedule title <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="title"
                                            placeholder='Type a title...'
                                            value={values.title}
                                            onChange={handleChange}
                                            isValid={(touched.title || submitted) && !errors.title}
                                            isInvalid={(touched.title || submitted) && !!errors.title}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.title}</Form.Control.Feedback>
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik12">
                                        <Form.Label>Job <span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            name="jobTitle"
                                            options={jobOptions}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={jobOptions.find(option => option.label === values.jobTitle)}
                                            onChange={(selectedOption) => {
                                                setFieldValue('jobTitle', selectedOption ? selectedOption.label : '');
                                            }}
                                            styles={createSelectStyles(touched, errors, submitted, "jobTitle")}
                                        />
                                        {(touched.jobTitle || submitted) && errors.jobTitle && (
                                            <div className="invalid-feedback d-block">{errors.jobTitle}</div>
                                        )}
                                    </Form.Group>
                                </Row>

                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik03">
                                        <Form.Label>Candidate name<span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            value={schedule.candidateName}
                                            readOnly
                                        />
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik04">
                                        <Form.Label>Interviewer<span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            isMulti
                                            name="interviewers"
                                            options={interviewerOptions}
                                            className="basic-multi-select"
                                            classNamePrefix="select"
                                            value={values.interviewers}
                                            onChange={(selectedOptions) => {
                                                setFieldValue('interviewers', selectedOptions);
                                            }}
                                            styles={createSelectStyles(touched, errors, submitted, "interviewers")}
                                        />
                                        {(touched.interviewers || submitted) && errors.interviewers && (
                                            <div className="invalid-feedback d-block">{errors.interviewers}</div>
                                        )}
                                    </Form.Group>
                                </Row>

                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik05">
                                        <Form.Label>Schedule Time <span className="requiredSpan">*</span></Form.Label>
                                        <DatePicker
                                            selected={values.interviewDate}
                                            onChange={(date) => setFieldValue('interviewDate', date)}
                                            placeholderText='dd/MM/yyyy'
                                            dateFormat="dd/MM/yyyy"
                                            customInput={
                                                <Form.Control isValid={(touched.interviewDate || submitted) && !errors.interviewDate}
                                                    isInvalid={(touched.interviewDate || submitted) && !!errors.interviewDate} />
                                            }
                                            wrapperClassName="w-100"
                                            className="react-datepicker-popper"
                                        />
                                        {(touched.interviewDate || submitted) && errors.interviewDate && (
                                            <div className="invalid-feedback d-block">{errors.interviewDate}</div>
                                        )}
                                    </Form.Group>
                                    <Form.Group as={Col} md="6" controlId="validationFormik06">
                                        <Form.Label>Location</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="location"
                                            placeholder='Type a location'
                                            value={values.location}
                                            onChange={handleChange}
                                            isValid={(touched.location || submitted) && !errors.location}
                                            isInvalid={(touched.location || submitted) && !!errors.location}
                                        />
                                    </Form.Group>
                                </Row>

                                <Row className="form-row">
                                    <Form.Group as={Col} md="3" controlId="validationFormik07">
                                        <Form.Label>From <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="startTime"
                                            value={values.startTime}
                                            onChange={handleChange}
                                            isValid={(touched.startTime || submitted) && !errors.startTime}
                                            isInvalid={(touched.startTime || submitted) && !!errors.startTime}
                                        />
                                        {(touched.startTime || submitted) && errors.startTime && (
                                            <div className="invalid-feedback d-block">{errors.startTime}</div>
                                        )}
                                    </Form.Group>

                                    <Form.Group as={Col} md="3" controlId="validationFormik08">
                                        <Form.Label>To <span className="requiredSpan">*</span></Form.Label>
                                        <Form.Control
                                            type="time"
                                            name="endTime"
                                            value={values.endTime}
                                            onChange={handleChange}
                                            isValid={(touched.endTime || submitted) && !errors.endTime}
                                            isInvalid={(touched.endTime || submitted) && !!errors.endTime}
                                        />
                                        {(touched.endTime || submitted) && errors.endTime && (
                                            <div className="invalid-feedback d-block">{errors.endTime}</div>
                                        )}
                                    </Form.Group>

                                    <Form.Group as={Col} md="6" controlId="validationFormik06">
                                        <Form.Label>Recruiter owner <span className="requiredSpan">*</span></Form.Label>
                                        <Select
                                            placeholder="Recruiter name"
                                            name="recruiterName"
                                            options={recruiterOptions}
                                            value={recruiterOptions.find(option => extractUsername(option.label) === values.recruiterName)}
                                            onChange={(selectedOption) => setFieldValue('recruiterName', selectedOption ? extractUsername(selectedOption.label) : '')}
                                            styles={createSelectStyles(touched, errors, submitted, "recruiterName")}
                                        />
                                        {(touched.recruiterName || submitted) && errors.recruiterName && (
                                            <div className="invalid-feedback d-block">{errors.recruiterName}</div>
                                        )}
                                        {hasPermission(userScope, 'assign') && (
                                            <Button
                                                variant="link"
                                                className="mt-2"
                                                onClick={handleAssignMe}
                                                type="button"
                                            >
                                                Assign me
                                            </Button>
                                        )}
                                    </Form.Group>
                                </Row>

                                <Row className="form-row">
                                    <Form.Group as={Col} md="6" controlId="validationFormik05">
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

                                    <Form.Group as={Col} md="6" controlId="validationFormik05">
                                        <Form.Label>Meeting ID</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="meetingLink"
                                            value={values.meetingLink}
                                            onChange={handleChange}
                                            isValid={(touched.meetingLink || submitted) && !errors.meetingLink}
                                            isInvalid={(touched.meetingLink || submitted) && !!errors.meetingLink}
                                        />
                                        <Form.Control.Feedback type="invalid">{errors.meetingLink}</Form.Control.Feedback>
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
            <ActionModal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                onConfirm={handleConfirmCancel}
                domainName="schedule"
                action="cancel"
                actionText="Cancel"
                variant="light"
            />
        </Container >
    );
}

export default ScheduleEdit;