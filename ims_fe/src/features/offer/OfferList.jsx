import React, { useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import List from '../../commons/List/List';
import { getOffers } from '../../store/offersSlice';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { formatText } from '../../utils/formatUtils';
import { departmentOptions, offerStatusOptions } from '../../utils/optionUtils';
import { resetFilters, setSearchStatus, setSearchDepartment } from '../../store/filterSlice';
import Loading from '../../commons/Loading/Loading';

const columns = [
  { key: 'name', header: 'Candidate name' },
  { key: 'email', header: 'Email' },
  { key: 'approver', header: 'Approved by' },
  { key: 'department', header: 'Department' },
  { key: 'note', header: 'Notes' },
  { key: 'status', header: 'Status' },
];

const OfferList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const offers = useSelector((state) => state.offers.list);
  const status = useSelector((state) => state.offers.status);
  const error = useSelector((state) => state.offers.error);
  const searchTerm = useSelector((state) => state.filter.searchTerm);
  const selectedStatus = useSelector((state) => state.filter.searchStatus);
  const selectedDepartment = useSelector((state) => state.filter.searchDepartment);
  const currentPage = useSelector(state => state.offers.currentPage);
  const totalPages = useSelector(state => state.offers.totalPages);


  const fetchOffers = useCallback(() => {
    const params = new URLSearchParams(location.search);
    const page = parseInt(params.get('page') || '1');
    const size = parseInt(params.get('size') || '10');
    const term = params.get('searchTerm') || '';
    const status = params.get('status') || '';
    const department = params.get('department') || '';

    dispatch(getOffers({ page, size, searchTerm: term, status, department }));
  }, [location.search, dispatch]);

  useEffect(() => {
    fetchOffers();
  }, [dispatch, location.search, fetchOffers]);

  useEffect(() => {
    dispatch(setPageInfo({ pageName: 'Offer', moduleName: 'Offer', moduleLink: 'offers', submoduleName: 'Offer List' }));
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
    if (selectedDepartment && selectedDepartment !== 'Department') searchParams.set('department', selectedDepartment);

    navigate(`/offers?${searchParams.toString()}`);
  };

  const handlePageChange = (page) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set('page', page.toString());
    navigate(`/offers?${searchParams.toString()}`);
  };

  if (status === 'loading') return <Loading />;

  const handleShowEditButton = (item) => {
    return item.status === 'WAITING_FOR_APPROVAL';
  };

  return (
    <>
      <List
        items={offers}
        columns={columns}
        domainName="offers"
        onSearch={handleSearch}
        onPageChange={handlePageChange}
        searchDropdowns={[
          {
            title: 'Department',
            options: departmentOptions,
            selectedValue: selectedDepartment,
            actionCreator: setSearchDepartment
          },
          {
            title: 'Status',
            options: offerStatusOptions,
            selectedValue: selectedStatus,
            actionCreator: setSearchStatus
          }
        ]}
        currentPage={currentPage}
        onShowEditButton={handleShowEditButton}
        onShowDeleteButton={() => false}
        totalPages={totalPages}
        formatters={{
          department: formatText,
          status: formatText
        }}
      />
    </>
  );
};

export default OfferList;