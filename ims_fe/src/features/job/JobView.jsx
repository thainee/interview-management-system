import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { getJobById } from '../../store/jobsSlice';
import DetailView from '../../commons/DetailView/DetailView';
import Loading from '../../commons/Loading/Loading';
import { Container } from 'react-bootstrap';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import { jwtDecode } from 'jwt-decode';

const JobView = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const job = useSelector((state) => state.jobs.currentJob);
    const status = useSelector((state) => state.jobs.status);
    const error = useSelector((state) => state.jobs.error);
    const token = localStorage.getItem('token');
    const {scope : userRole } = jwtDecode(token);
    const showEditButton = userRole === 'ADMIN' && 'MANAGER' && 'RECRUITER';

    useEffect(() => {
        dispatch(getJobById(id));
        dispatch(setPageInfo({ pageName: 'Job', moduleName: 'Job List', moduleLink: 'jobs', submoduleName: 'Job Information' }));
    }, [dispatch, id]);

    useEffect(() => {
        if (status === 'failed') {
            dispatch(setToast({ type: 'error', message: error.message }));
        }
    }, [status, dispatch, error]);

    if (status === 'loading') return <Loading />;
    if (status === 'failed') return <div>Error loading job</div>;
    if (!job) return <div>No job found</div>;

    const formatSalaryRange = (from, to) => (
        <span>
            From: {from} <span style={{ margin: '0 15px' }}></span> To: {to}
        </span>
    );

    const sections = [
        {
            columns: [
                [
                    { label: 'Job title', value: job.title },
                    { label: 'Start date', value: job.startDate, type: 'date' },
                    { 
                        label: 'Salary range', 
                        value: formatSalaryRange(job.salaryFrom, job.salaryTo),
                    },
                ],
                [
                    { label: 'Skills', value: job.skills, type: 'array' },
                    { label: 'End date', value: job.endDate, type: 'date' },
                    { label: 'Benefits', value: job.benefits, type: 'array' },
                ],
            ],
        },
        {
            columns: [
                [
                    { label: 'Working address', value: job.address },
                    { label: 'Status', value: job.status, type: 'enum' }
                ],
                [
                    { label: 'Level', value: job.levels, type: 'array' },
                    { label: 'Description', value: job.description }
                ],
            ],
        },
    ];

    return (
        <Container>
            <BreadcrumbComponent />
            <DetailView
                item={job}
                sections={sections}
                editLink={`/jobs/${id}/edit`}
                backLink="/jobs"
                showEditButton={showEditButton}
            />
        </Container>
    );
}

export default JobView;