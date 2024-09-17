import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '../../commons/List/List';
import ActionModal from '../../commons/ActionModal/ActionModal';
import {
  getCandidates,
  deleteCandidateById,
} from '../../store/candidatesSlice';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { formatText } from '../../utils/formatUtils';
import { candidateStatusOptions } from '../../utils/optionUtils';
import { resetFilters, setSearchStatus } from '../../store/filterSlice';
import Loading from '../../commons/Loading/Loading';
import { jwtDecode } from 'jwt-decode';

const columns = [
  { key: 'fullName', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'phoneNumber', header: 'Phone number' },
  { key: 'position', header: 'Current Position' },
  { key: 'ownerHR', header: 'Owner HR' },
  { key: 'status', header: 'Status' },
];

const CandidateList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const candidates = useSelector((state) => state.candidates.list);
  const status = useSelector((state) => state.candidates.status);
  const error = useSelector((state) => state.candidates.error);
  const selectedStatus = useSelector((state) => state.filter.searchStatus);
  const currentPage = useSelector((state) => state.candidates.currentPage);
  const totalPages = useSelector((state) => state.candidates.totalPages);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [candidateToAction, setCandidateToAction] = useState(null);
  const userRole = jwtDecode(localStorage.getItem('token')).scope;

  const fetchCandidates = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1');
    const size = parseInt(params.get('size') || '10');
    const term = params.get('searchTerm') || '';
    const status = params.get('status') || '';

    dispatch(getCandidates({ page, size, searchTerm: term, status }));
  }, [location.search, dispatch]);

  useEffect(() => {
    fetchCandidates();
  }, [dispatch, location.search, fetchCandidates]);

  useEffect(() => {
    dispatch(
      setPageInfo({
        pageName: 'Candidate',
        moduleName: 'Candidate',
        moduleLink: 'candidates',
        submoduleName: 'Candidate List',
      })
    );
    return () => dispatch(resetFilters());
  }, [dispatch]);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(setToast({ type: 'error', message: error.message }));
    }
  }, [status, dispatch, error]);

  const handleSearch = (term) => {
    const searchParams = new URLSearchParams();
    if (term) {
      searchParams.set('searchTerm', term);
    } else {
      searchParams.delete('searchTerm');
    }
    if (selectedStatus && selectedStatus !== 'Status')
      searchParams.set('status', selectedStatus);

    navigate(`/candidates?${searchParams.toString()}`);
  };

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page.toString());
    navigate(`/candidates?${searchParams.toString()}`);
  };

  const handleDeleteClick = (candidate) => {
    setCandidateToAction(candidate);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await dispatch(deleteCandidateById(candidateToAction.id)).unwrap();
      dispatch(
        setToast({
          type: 'success',
          message: 'Candidate deleted successfully!',
        })
      );
      setShowDeleteModal(false);
      fetchCandidates();
    } catch (error) {
      dispatch(
        setToast({ type: 'error', message: 'Failed to delete candidate.' })
      );
    }
  };

  if (status === 'loading') return <Loading />;

  const handleShowDeleteButton = (item) => {
    return userRole !== 'INTERVIEWER' && (item.status === 'OPEN' || item.status === 'BANNED');
  };

  const handleShowEditButton = (item) => {
    return userRole !== 'INTERVIEWER';
  };

  const showAddButton = userRole !== 'INTERVIEWER';

  return (
    <>
      <List
        items={candidates}
        columns={columns}
        domainName='candidates'
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        onDeleteClick={handleDeleteClick}
        searchDropdowns={[
          {
            title: 'Status',
            options: candidateStatusOptions,
            selectedValue: selectedStatus,
            actionCreator: setSearchStatus,
          },
        ]}
        currentPage={currentPage}
        totalPages={totalPages}
        formatters={{
          position: formatText,
          status: formatText,
        }}
        onShowDeleteButton={handleShowDeleteButton}
        onShowEditButton={handleShowEditButton}
        showAddButton={showAddButton}
      />
      <ActionModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteConfirm}
        domainName='candidate'
        action='delete'
        actionText='Deletion'
        variant='danger'
      />
    </>
  );
};

export default CandidateList;
