import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import Container from 'react-bootstrap/Container';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../assets/css/styles.css';
import { getScheduleById, sendReminder } from '../../store/scheduleSlice';
import { formatText, formatDate, formatTime } from '../../utils/formatUtils';
import Loading from '../../commons/Loading/Loading';
import ActionModal from '../../commons/ActionModal/ActionModal';
import useUserScope from '../../hooks/useUserScope';


const ScheduleDetail = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const schedule = useSelector((state) => state.schedules.currentSchedule);
    const status = useSelector((state) => state.schedules.status);
    const [showSendModal, setShowSendModal] = useState(false);
    const userScope = useUserScope();

    const actionPermissions = {
        sendReminder: ['RECRUITER', 'MANAGER', 'ADMIN'],
        edit: ['RECRUITER', 'MANAGER', 'ADMIN']
    };

    const hasPermission = (userScope, action) => {
        return actionPermissions[action].includes(userScope);
    };


    useEffect(() => {
        dispatch(getScheduleById(id));
        dispatch(setPageInfo({ pageName: 'Interview Schedules', moduleName: 'Schedule List', moduleLink: 'schedules', submoduleName: 'Schedule Information' }));
    }, [dispatch, id]);

    if (status === 'loading') return <Loading />;

    if (status === 'failed') {
        return <div>Error loading schedule</div>;
    }

    if (!schedule) {
        return <div>No schedule found</div>;
    }

    const InterviewersList = ({ interviewers }) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {interviewers?.map((interviewer, index) => (
                <span key={interviewer.id}>
                    {interviewer.userName}
                    {index < interviewers.length - 1 ? ', ' : ''}
                </span>
            ))}
        </div>
    );
    const shouldShowSendReminderButton = () => {
        return schedule && (schedule.status === 'NEW' || schedule.status === 'INVITED');
    };

    const handleSendReminder = async () => {
        if (schedule && schedule.interviewers && (schedule.status === 'NEW' || schedule.status === 'INVITED')) {
            const emails = schedule.interviewers.map(interviewer => interviewer.email);
            try {
                await dispatch(sendReminder({ emails, id })).unwrap();
                dispatch(setToast({ type: 'success', message: 'Email sending process started!' }));
            } catch (error) {
                console.error('Failed to send reminder emails:', error);
                dispatch(setToast({ type: 'error', message: 'Failed to start email sending process.' }));
            } finally {
                setShowSendModal(false);
            }
        } else {
            dispatch(setToast({ type: 'warning', message: 'Cannot send reminder for this schedule status.' }));
            setShowSendModal(false);
        }
    };


    return (
        <Container>
            <BreadcrumbComponent />
            <div className='p-4 bg-white rounded-3'>
                {hasPermission(userScope, 'sendReminder') && shouldShowSendReminderButton() && (
                    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Button variant="info" onClick={() => setShowSendModal(true)}>
                            Send reminder
                        </Button>
                    </div>
                )}
                <Row>
                    <Col md={6}>
                        <Row className="mb-3">
                            <Col md={4}><strong>Schedule title:</strong></Col>
                            <Col md={8}>{schedule.title}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Candidate name:</strong></Col>
                            <Col md={8}>{schedule.candidateName}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Schedule time:</strong></Col>
                            <Col md={8}>{formatDate(schedule.interviewDate)}
                                <br />
                                From {formatTime(schedule.startTime)} To {formatTime(schedule.endTime)}
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Note:</strong></Col>
                            <Col md={8}>{schedule.note}</Col>
                        </Row>
                    </Col>
                    <Col md={6}>
                        <Row className="mb-3">
                            <Col md={4}><strong>Job:</strong></Col>
                            <Col md={8}>{schedule.jobTitle}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Interviewer:</strong></Col>
                            <Col md={8}>
                                <InterviewersList interviewers={schedule.interviewers} />
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Location:</strong></Col>
                            <Col md={8}>{schedule.location}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Recruiter owner:</strong></Col>
                            <Col md={8}>{schedule.recruiterName}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Meeting ID:</strong></Col>
                            <Col md={8}>
                                <a href={schedule.meetingLink.startsWith('https') ? schedule.meetingLink : `https://${schedule.meetingLink}`} target="_blank" rel="noreferrer">{schedule.meetingLink}</a>
                            </Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Result:</strong></Col>
                            <Col md={8}>{schedule.result !== "" ? schedule.result : 'N/A'}</Col>
                        </Row>
                        <Row className="mb-3">
                            <Col md={4}><strong>Status:</strong></Col>
                            <Col md={8}>{formatText(schedule.status)}</Col>
                        </Row>
                    </Col>
                </Row>
                <div className='d-flex justify-content-center align-items-center mt-4'>
                    {(hasPermission(userScope, 'edit') && schedule.status !== 'INTERVIEWED' && schedule.status !== 'CLOSED') && (
                        <Button variant="primary" onClick={() => navigate(`/schedules/${id}/edit`)}>
                            Edit
                        </Button>
                    )
                    }
                    <Button variant="secondary" className="ms-2" onClick={() => navigate('/schedules')}>
                        Go back
                    </Button>
                </div>
            </div>
            <ActionModal
                show={showSendModal}
                onHide={() => setShowSendModal(false)}
                onConfirm={handleSendReminder}
                domainName="schedule"
                action="send"
                actionText="mail reminder"
                variant="light"
            />
        </Container>
    );
}

export default ScheduleDetail;
