import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import {
  banCandidateById,
  getCandidateById,
} from '../../store/candidatesSlice';
import DetailView from '../../commons/DetailView/DetailView';
import Loading from '../../commons/Loading/Loading';
import ActionModal from '../../commons/ActionModal/ActionModal';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import { Button, Container } from 'react-bootstrap';
import { jwtDecode } from 'jwt-decode';
import ResourceNotFound from '../../commons/ResourceNotFound/ResourceNotFound';

const CandidateView = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const candidate = useSelector((state) => state.candidates.currentCandidate);
  const status = useSelector((state) => state.candidates.status);
  const error = useSelector((state) => state.candidates.error);
  const token = localStorage.getItem('token');
  const { scope: userRole } = jwtDecode(token);
  const showEditButton = userRole !== 'INTERVIEWER';
  const [showBanModal, setShowBanModal] = useState(false);

  useEffect(() => {
    dispatch(getCandidateById(id));
    dispatch(
      setPageInfo({
        pageName: 'Candidate',
        moduleName: 'Candidate List',
        moduleLink: 'candidates',
        submoduleName: 'Candidate Information',
      })
    );
  }, [dispatch, id]);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(setToast({ type: 'error', message: error.message }));
    }
  }, [status, dispatch, error]);

  if (status === 'loading') return <Loading />;
  if (!candidate) return <ResourceNotFound />;
  const showBanButton =
    userRole !== 'INTERVIEWER' &&
    candidate.status !== 'BANNED' &&
    candidate.status === 'OPEN';

  const handleBanClick = () => {
    setShowBanModal(true);
  };

  const handleBanConfirm = async () => {
    try {
      await dispatch(banCandidateById(candidate.id)).unwrap();
      dispatch(
        setToast({ type: 'success', message: 'Candidate banned successfully!' })
      );
      setShowBanModal(false);
    } catch (error) {
      dispatch(
        setToast({ type: 'error', message: 'Failed to ban candidate.' })
      );
    }
  };

  const sections = [
    {
      title: 'I. Personal information',
      columns: [
        [
          { label: 'Full name', value: candidate.fullName },
          { label: 'D.O.B', value: candidate?.dob, type: 'date' },
          { label: 'Phone number', value: candidate.phoneNumber },
        ],
        [
          { label: 'Email', value: candidate.email },
          { label: 'Address', value: candidate.address },
          { label: 'Gender', value: candidate.gender, type: 'enum' },
        ],
      ],
    },
    {
      title: 'II. Professional Information',
      columns: [
        [
          {
            label: 'CV Attachment',
            value: candidate.cvCandidate,
            displayValue: candidate.cvCandidate,
            type: 'link',
          },
          { label: 'Position', value: candidate.position, type: 'enum' },
          { label: 'Skills', value: candidate.skills, type: 'array' },
          { label: 'Recruiter', value: candidate.recruiterDisplayName },
        ],
        [
          { label: 'Status', value: candidate.status, type: 'enum' },
          { label: 'Year of experience', value: candidate.experience },
          {
            label: 'Highest Level',
            value: candidate.highestLevel,
            type: 'enum',
          },
          {
            label: 'Note',
            value: candidate.note,
            valueClassName: 'noteContainer',
          },
        ],
      ],
    },
  ];

  return (
    <Container>
      <BreadcrumbComponent>
        {showBanButton && (
          <Button onClick={handleBanClick} variant='danger'>
            Ban Candidate
          </Button>
        )}
      </BreadcrumbComponent>
      <DetailView
        item={candidate}
        sections={sections}
        editLink={`/candidates/${id}/edit`}
        showEditButton={showEditButton}
      />
      <ActionModal
        show={showBanModal}
        onHide={() => setShowBanModal(false)}
        onConfirm={handleBanConfirm}
        domainName='candidate'
        action='ban'
        actionText='Ban'
        variant='danger'
      />
    </Container>
  );
};

export default CandidateView;
