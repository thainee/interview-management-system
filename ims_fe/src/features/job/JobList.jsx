import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '../../commons/List/List';
import ActionModal from '../../commons/ActionModal/ActionModal';
import { getJobs, deleteJobById } from '../../store/jobsSlice';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { formatText, formatDate } from '../../utils/formatUtils';
import { jobStatusOptions } from '../../utils/optionUtils';
import { resetFilters, setSearchStatus } from '../../store/filterSlice';
import Loading from '../../commons/Loading/Loading';
import {jwtDecode} from "jwt-decode";

const columns = [
    { key: 'title', header: 'Job Title' },
    { key: 'skills', header: 'Required Skills' },
    { key: 'startDate', header: 'Start date' },
    { key: 'endDate', header: 'End date' },
    { key: 'levels', header: 'Level' },
    { key: 'status', header: 'Status' },
];

const JobList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const jobs = useSelector((state) => state.jobs.list);
    const status = useSelector((state) => state.jobs.status);
    const error = useSelector((state) => state.jobs.error);
    const searchTerm = useSelector((state) => state.filter.searchTerm);
    const selectedStatus = useSelector((state) => state.filter.searchStatus);
    const currentPage = useSelector(state => state.jobs.currentPage);
    const totalPages = useSelector(state => state.jobs.totalPages);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [jobToAction, setJobToAction] = useState(null);
    const token = localStorage.getItem('token');
    const {scope : userRole } = jwtDecode(token);
    const showEditButton = userRole === 'ADMIN' && 'MANAGER' && 'RECRUITER';


    const fetchJobs = useCallback(() => {
        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page') || '1');
        const size = parseInt(params.get('size') || '10');
        const term = params.get('searchTerm') || '';
        const status = params.get('status') || '';

        dispatch(getJobs({ page, size, searchTerm: term, status }));
    }, [location.search, dispatch]);

    useEffect(() => {
        fetchJobs();
    }, [dispatch, location.search, fetchJobs]);

    useEffect(() => {
        dispatch(setPageInfo({ pageName: 'Job', moduleName: 'Job', moduleLink: 'jobs', submoduleName: 'Job List' }));
        return () => dispatch(resetFilters());
    }, [dispatch]);

    useEffect(() => {
        if (status === 'failed') {
            dispatch(setToast({ type: 'error', message: error.message }));
        }
    }, [status, dispatch, error]);

    const handleSearch = (term) => {
        const searchParams = new URLSearchParams();
        if (term) searchParams.set('searchTerm', term)
        else if (searchTerm) searchParams.set('searchTerm', searchTerm);
        if (selectedStatus && selectedStatus !== 'Status') searchParams.set('status', selectedStatus);

        navigate(`/jobs?${searchParams.toString()}`);
    };
    const handleShowDeleteButton = (item) => {
        return userRole !== 'INTERVIEWER' && item.status === 'OPEN';
    };

    const handleShowEditButton = (item) => {
        return userRole !== 'INTERVIEWER';
    };
    const showAddButton = userRole !== 'INTERVIEWER';

    const handlePageChange = (page) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page.toString());
        navigate(`/jobs?${searchParams.toString()}`);
    };

    const handleDeleteClick = (job) => {
        setJobToAction(job);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        try {
            await dispatch(deleteJobById(jobToAction.id)).unwrap();
            dispatch(setToast({ type: 'success', message: 'Job deleted successfully!' }));
            setShowDeleteModal(false);
            fetchJobs();
        } catch (error) {
            dispatch(setToast({ type: 'error', message: 'Failed to delete job.' }));
        }
    };

    if (status === 'loading') return <Loading />;

    return (
        <>
            <List
                items={jobs}
                columns={columns}
                domainName="jobs"
                onSearch={handleSearch}
                onPageChange={handlePageChange}
                onDeleteClick={handleDeleteClick}
                searchDropdowns={[
                    {
                        title: 'Status',
                        options: jobStatusOptions,
                        selectedValue: selectedStatus,
                        actionCreator: setSearchStatus
                    }
                ]}
                currentPage={currentPage}
                totalPages={totalPages}
                formatters={{
                    skills: formatText,
                    status: formatText,
                    levels: formatText,
                    startDate: formatDate,
                    endDate: formatDate

                }}
                onShowDeleteButton={handleShowDeleteButton}
                onShowEditButton={handleShowEditButton}
                showAddButton={showAddButton}


            />
            <ActionModal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                onConfirm={handleDeleteConfirm}
                domainName="job"
                action="delete"
                actionText="Deletion"
                variant="danger"
            />
        </>
    );
};

export default JobList;