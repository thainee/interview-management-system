import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Table, Container, Row, Col, Image } from 'react-bootstrap';
import PaginationComponent from '../../components/PaginationComponent';
import SearchbarComponent from '../../components/SearchbarComponent';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import { setPageInfo } from '../../store/uiSlice';
import { getSchedules, getInterviewers } from '../../store/scheduleSlice';
import { scheduleStatusOptions } from '../../utils/optionUtils';
import { setSearchStatus, setSearchInterviewer } from '../../store/filterSlice';
import { formatText, formatDate, formatTime } from '../../utils/formatUtils';
import Loading from '../../commons/Loading/Loading';
import ResourceNotFound from '../../commons/ResourceNotFound/ResourceNotFound';
import useUserScope from '../../hooks/useUserScope';
import { jwtDecode } from 'jwt-decode';

const ScheduleList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const searchTerm = useSelector((state) => state.filter.searchTerm);
    const location = useLocation();
    const { list: schedules, status, error, currentPage, totalPages, scheduleInterviewers } = useSelector((state) => state.schedules);
    const selectedStatus = useSelector((state) => state.filter.searchStatus);
    const selectedInterviewer = useSelector((state) => state.filter.searchInterviewer);
    const userScope = useUserScope();

    const { userId: currentUserId } = jwtDecode(localStorage.getItem('token'));

    const actionPermissions = {
        view: ['RECRUITER', 'MANAGER', 'INTERVIEWER', 'ADMIN'],
        edit: ['RECRUITER', 'MANAGER', 'ADMIN'],
        submit: ['INTERVIEWER']
    };

    const hasPermission = (userScope, action) => {
        return actionPermissions[action].includes(userScope);
    };

    const isInterviewerInSchedule = (schedule, currentUserId) => {
        return schedule.interviewers.some(interviewer => interviewer.id === currentUserId);
    };

    const fetchSchedules = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page') || '1', 10);
        const size = parseInt(params.get('size') || '10', 10);
        const term = params.get('searchTerm') || '';
        const interviewer = params.get('interviewer') || '';
        const status = params.get('status') || '';

        dispatch(getSchedules({ page, size, searchTerm: term, interviewer, status }));
    }, [dispatch, location.search]);

    useEffect(() => {
        dispatch(setPageInfo({ pageName: 'Interview Schedules', moduleName: 'Schedule', moduleLink: 'schedules', submoduleName: 'Schedule List' }));
        fetchSchedules();
        dispatch(getInterviewers());
    }, [dispatch, fetchSchedules]);

    const interviewerOptions = [
        { value: '', label: 'Interviewer' },
        ...scheduleInterviewers.map(interviewer => ({
            value: interviewer.id,
            label: interviewer.fullName
        }))
    ];

    const handleSearch = ((term) => {
        const searchParams = new URLSearchParams();
        if (term) searchParams.set('searchTerm', term);
        else if (searchTerm) searchParams.set('searchTerm', searchTerm);
        if (selectedInterviewer) searchParams.set('interviewer', selectedInterviewer);
        if (selectedStatus && selectedStatus !== 'Status') searchParams.set('status', selectedStatus);
        navigate(`/schedules?${searchParams.toString()}`);
    });

    const handlePageChange = useCallback((page) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page.toString());
        navigate(`/schedules?${searchParams.toString()}`);
    }, [navigate, location.search]);

    if (status === 'loading') return <Loading />;
    if (status === 'failed') return <div>Error: {error}</div>;

    return (
        <Container>
            <BreadcrumbComponent />
            <div className='p-4 bg-white rounded-3'>
                <Row className='mt-3'>
                    <Col>
                        <SearchbarComponent
                            onSearch={handleSearch}
                            dropdowns={[
                                {
                                    title: 'Interviewer',
                                    options: interviewerOptions,
                                    selectedValue: selectedInterviewer,
                                    actionCreator: setSearchInterviewer
                                },
                                {
                                    title: 'Status',
                                    options: scheduleStatusOptions,
                                    selectedValue: selectedStatus,
                                    actionCreator: setSearchStatus
                                }
                            ]}
                        />
                    </Col>
                    <Col xs={4} className='d-flex justify-content-end'>
                        <Link to="/schedules/create" className='d-block me-3' style={{ width: '50px', height: '50px' }}>
                            <Image src="add.png" width={40} alt="Add new schedule" />
                        </Link>
                    </Col>
                </Row>
                {schedules.length > 0 ? (
                    <>
                        <Table className='mb-5 mt-4' hover>
                            <thead>
                                <tr>
                                    <th>Title</th>
                                    <th>Candidate Name</th>
                                    <th>Interviewer</th>
                                    <th>Schedule</th>
                                    <th>Result</th>
                                    <th>Status</th>
                                    <th>Job</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedules.map((schedule) => (
                                    <tr key={schedule.id}>
                                        <td>{schedule.title}</td>
                                        <td>{schedule.candidateName}</td>
                                        <td>
                                            {schedule.interviewers.length > 0 ? schedule.interviewers[0].fullName : 'No interviewer assigned'}
                                        </td>
                                        <td>{formatDate(schedule.interviewDate)} {formatTime(schedule.startTime)} - {formatTime(schedule.endTime)}</td>
                                        <td>{schedule.result}</td>
                                        <td>{formatText(schedule.status)}</td>
                                        <td>{schedule.jobTitle}</td>
                                        <td>
                                            <div className='d-flex align-items-center gap-3'>
                                                {hasPermission(userScope, 'view') && (
                                                    <Link to={`/schedules/${schedule.id}`}>
                                                        <Image src="/actions/view.png" width={16} alt="View" />
                                                    </Link>
                                                )}
                                                {(hasPermission(userScope, 'edit') && schedule.status !== 'CLOSED' && schedule.status !== 'INTERVIEWED' && schedule.status !== 'CANCELLED') && (
                                                    <Link to={`/schedules/${schedule.id}/edit`}>
                                                        <Image src="/actions/edit.png" width={16} alt="Edit" />
                                                    </Link>
                                                )}
                                                {(hasPermission(userScope, 'submit') && schedule.result === '' && isInterviewerInSchedule(schedule, currentUserId)) && (
                                                    <Link to={`/schedules/${schedule.id}/submit`}>
                                                        <Image src="/actions/submit.png" width={16} alt="submit" />
                                                    </Link>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                        <PaginationComponent onPageChange={handlePageChange} totalPages={totalPages} currentPage={currentPage} />
                    </>
                ) : (
                    <ResourceNotFound />
                )}
            </div>
        </Container>
    );
};

export default ScheduleList;