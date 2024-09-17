import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'; // Import useHistory
import { setPageInfo, setToast } from '../../store/uiSlice';
import {
  cancelOfferById,
  getOfferById,
  approveOfferById,
  rejectOfferById,
  sentOfferById,
  acceptOfferById,
  declineOfferById,
} from '../../store/offersSlice';
import DetailView from '../../commons/DetailView/DetailView';
import Loading from '../../commons/Loading/Loading';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import { Button, Container } from 'react-bootstrap';
import ActionModal from '../../commons/ActionModal/ActionModal';
import useUserScope from '../../hooks/useUserScope';

const OfferView = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const offer = useSelector((state) => state.offers.currentOffer);
  const status = useSelector((state) => state.offers.status);
  const error = useSelector((state) => state.offers.error);
  const [showActionModal, setShowActionModal] = useState(false);
  const [actionType, setActionType] = useState('');
  const [actionColor, setActionColor] = useState('');
  const userScope = useUserScope();

  const actionPermissions = {
    editStatus: ['MANAGER', 'ADMIN'],
  };

  const hasPermission = (userScope, action) => {
    return actionPermissions[action].includes(userScope);
  };

  useEffect(() => {
    dispatch(getOfferById(id));
    dispatch(
      setPageInfo({
        pageName: 'Offer',
        moduleName: 'Offer List',
        moduleLink: 'offers',
        submoduleName: 'Offer Details',
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(setToast({ type: 'error', message: error.message }));
    }
  }, [status, dispatch, error]);

  const handleActionClick = (action, color) => {
    setActionType(action);
    setActionColor(color);
    setShowActionModal(true);
  };

  const handleActionConfirm = async () => {
    try {
      let actionPromise;
      if (actionType === 'cancel') {
        actionPromise = dispatch(cancelOfferById(id)).unwrap();
      } else if (actionType === 'approve') {
        actionPromise = dispatch(approveOfferById(id)).unwrap();
      } else if (actionType === 'reject') {
        actionPromise = dispatch(rejectOfferById(id)).unwrap();
      } else if (actionType === 'sent to candidate') {
        actionPromise = dispatch(sentOfferById(id)).unwrap();
      } else if (actionType === 'accept') {
        actionPromise = dispatch(acceptOfferById(id)).unwrap();
      } else if (actionType === 'decline') {
        actionPromise = dispatch(declineOfferById(id)).unwrap();
      }

      await actionPromise;
      dispatch(
        setToast({
          type: 'success',
          message: `Offer ${actionType}ed successfully!`,
        })
      );
      setShowActionModal(false);
    } catch (error) {
      dispatch(
        setToast({ type: 'error', message: `Failed to ${actionType} offer.` })
      );
    }
  };

  if (status === 'loading') return <Loading />;
  if (status === 'failed') return <div>Error loading offer</div>;
  if (!offer) return <div>No offer found</div>;

  const sections = [
    {
      columns: [
        [
          { label: 'Candidate', value: offer.candidateName },
          { label: 'Position', value: offer.position, type: 'enum' },
          { label: 'Approver', value: offer.approvedByName },
          { label: 'Interview info', value: offer.interviewInfo },
          {
            label: 'Contract period from',
            value: offer.contractFrom,
            type: 'date',
          },
          { label: 'Interview note', value: offer.interviewNote },
          { label: 'Status', value: offer.status, type: 'enum' },
        ],
        [
          { label: 'Contract type', value: offer.contractType, type: 'enum' },
          { label: 'Level', value: offer.level, type: 'enum' },
          { label: 'Department', value: offer.department, type: 'enum' },
          { label: 'Recruiter owner', value: offer.recruiterName },
          {
            label: 'Contract period to',
            value: offer.contractTo,
            type: 'date',
          },
          { label: 'Due date', value: offer.dueDate, type: 'date' },
          { label: 'Basic salary', value: offer.salary },
          { label: 'Note', value: offer.note },
        ],
      ],
    },
  ];

  const showEditButton = offer.status === 'WAITING_FOR_APPROVAL';
  const onShowApproveButton = offer.status === 'WAITING_FOR_APPROVAL';
  const onShowRejectButton = offer.status === 'WAITING_FOR_APPROVAL';
  const onShowSentButton = offer.status === 'APPROVED';
  const onShowAcceptButton = offer.status === 'WAITING_FOR_RESPONSE';
  const onShowDeclineButton = offer.status === 'WAITING_FOR_RESPONSE';
  const onShowCancelButton =
    offer.status !== 'CANCELLED' &&
    offer.status !== 'DECLINED_OFFER' &&
    offer.status !== 'REJECTED';

  return (
    <Container>
      <BreadcrumbComponent>
        <div className='d-flex align-items-center gap-2'>
          {hasPermission(userScope, 'editStatus') && onShowApproveButton && (
            <Button
              onClick={() => handleActionClick('approve', 'success')}
              variant='success'
            >
              Approve Offer
            </Button>
          )}
          {hasPermission(userScope, 'editStatus') && onShowRejectButton && (
            <Button
              onClick={() => handleActionClick('reject', 'danger')}
              variant='danger'
            >
              Reject Offer
            </Button>
          )}
          {onShowSentButton && (
            <Button
              onClick={() => handleActionClick('sent to candidate', 'primary')}
              variant='primary'
            >
              Mark As Sent to Candidate
            </Button>
          )}
          {onShowAcceptButton && (
            <Button
              onClick={() => handleActionClick('accept', 'primary')}
              variant='primary'
            >
              Accept Offer
            </Button>
          )}
          {onShowDeclineButton && (
            <Button
              onClick={() => handleActionClick('decline', 'warning')}
              variant='warning'
            >
              Decline Offer
            </Button>
          )}
          {onShowCancelButton && (
            <Button
              onClick={() => handleActionClick('cancel', 'danger')}
              variant='danger'
            >
              Cancel Offer
            </Button>
          )}
        </div>
      </BreadcrumbComponent>
      <DetailView
        item={offer}
        sections={sections}
        showEditButton={showEditButton}
        editLink={`/offers/${id}/edit`}
      />
      <ActionModal
        show={showActionModal}
        onHide={() => setShowActionModal(false)}
        onConfirm={handleActionConfirm}
        domainName='offer'
        action={actionType}
        actionText={actionType.charAt(0).toUpperCase() + actionType.slice(1)}
        variant={actionColor}
      />
    </Container>
  );
};

export default OfferView;
