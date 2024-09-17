import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import {
  getEditCandidateById,
  updateCandidateById,
} from '../../store/candidatesSlice';
import GenericForm from '../../commons/GenericForm/GenericForm';
import {
  skillOptions,
  genderOptions,
  highestLevelOptions,
  positionOptions,
} from '../../utils/optionUtils';
import { candidateSchema } from '../../utils/formYupValidation';
import { formatDateRequest, formatText } from '../../utils/formatUtils';
import Loading from '../../commons/Loading/Loading';
import { useRecruiterOptions } from '../../hooks/useRecruiterOptions';
import { jwtDecode } from 'jwt-decode';
import ResourceNotFound from '../../commons/ResourceNotFound/ResourceNotFound';

const CandidateEdit = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const candidate = useSelector((state) => state.candidates.currentCandidate);
  const status = useSelector((state) => state.candidates.status);
  const error = useSelector((state) => state.candidates.error);

  useEffect(() => {
    dispatch(getEditCandidateById(id));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(
      setPageInfo({
        pageName: 'Candidate',
        moduleName: 'Candidate',
        moduleLink: 'candidates',
        submoduleName: 'Edit Candidate information',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (status === 'failed') {
      dispatch(setToast({ type: 'error', message: error.message }));
    }
  }, [status, dispatch, error]);

  const { recruiterOptions, isLoading } = useRecruiterOptions();

  if (status === 'loading' || isLoading) return <Loading />;
  if (!candidate) return <ResourceNotFound />;

  const isEditting = true;
  const schema = candidateSchema(isEditting);

  const initialValues = {
    fullName: candidate.fullName,
    email: candidate.email,
    gender: candidate.gender,
    dob: formatDateRequest(candidate.dob),
    address: candidate.address,
    phoneNumber: candidate.phoneNumber,
    cv: '',
    status: candidate.status,
    currentPosition: candidate.position,
    skills: candidate.skills.map((skill) => ({
      value: skill,
      label: formatText(skill),
    })),
    experience: candidate.experience,
    highestLevel: candidate.highestLevel,
    recruiterId: candidate.recruiterId,
    note: candidate.note,
    createdAt: candidate.createdAt,
    updatedAt: candidate.updatedAt,
    updatedBy: candidate.updatedBy,
  };

  const fields = [
    {
      title: 'I. Personal information',
      fields: [
        { name: 'fullName', label: 'Full name', type: 'text', required: true },
        { name: 'email', label: 'Email', type: 'email', required: true },
        {
          name: 'gender',
          label: 'Gender',
          type: 'select',
          options: genderOptions,
          required: true,
        },
        { name: 'dob', label: 'D.O.B', type: 'date', required: true },
        { name: 'address', label: 'Address', type: 'text', required: true },
        {
          name: 'phoneNumber',
          label: 'Phone number',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      title: 'II. Professional Information',
      fields: [
        { name: 'cv', label: 'CV Attachment', type: 'file', required: true },
        {
          name: 'currentPosition',
          label: 'Current position',
          type: 'select',
          options: positionOptions,
          required: true,
        },
        {
          name: 'skills',
          label: 'Skills',
          type: 'multiSelect',
          options: skillOptions,
          required: true,
        },
        { name: 'experience', label: 'Years of experience', type: 'number' },
        {
          name: 'highestLevel',
          label: 'Highest level',
          type: 'select',
          options: highestLevelOptions,
          required: true,
        },
        {
          name: 'recruiterId',
          label: 'Recruiter',
          type: 'select',
          options: recruiterOptions,
          required: true,
        },
        { name: 'note', label: 'Note', type: 'textarea' },
      ],
    },
  ];

  const breadcrumbItems = [
    { text: 'Candidate', link: '/candidates' },
    { text: 'Create Candidate', active: true },
  ];

  const { userId: currentUserId } = jwtDecode(localStorage.getItem('token'));

  const handleAssignMe = (setFieldValue) => {
    setFieldValue('recruiterId', currentUserId);
  };

  const handleSubmit = async (values, setSubmitting) => {
    try {
      const formData = new FormData();

      // Convert skills array to string array of skill values
      const skillValues = values.skills.map((skill) => skill.value);

      // Create candidateData object
      const candidateData = {
        fullName: values.fullName,
        email: values.email,
        gender: values.gender,
        dob: values.dob,
        address: values.address,
        phoneNumber: values.phoneNumber,
        position: values.currentPosition,
        skills: skillValues,
        experience:
          values.experience === '' ? null : parseInt(values.experience),
        highestLevel: values.highestLevel,
        recruiterId: values.recruiterId,
        note: values.note,
        updatedBy: currentUserId,
        cv: candidate.cv,
      };

      // Append candidateData as JSON string
      formData.append(
        'candidateRequestDto',
        new Blob([JSON.stringify(candidateData)], { type: 'application/json' })
      );

      // In handleSubmit function
      if (values.cv && values.cv instanceof File) {
        formData.append('cv', values.cv);
      } else {
        // If no new file is selected, send an empty file or null
        formData.append('cv', new File([], ''));
      }

      await dispatch(updateCandidateById({ id, formData })).unwrap();
      dispatch(
        setToast({
          type: 'success',
          message: 'Candidate updated successfully!',
        })
      );
      navigate('/candidates/');
    } catch (error) {
      let firstErrorMessage;
      if (error.message) {
        firstErrorMessage = error.message;
      } else {
        firstErrorMessage = Object.values(error)[0];
      }
      dispatch(setToast({ type: 'error', message: firstErrorMessage }));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <GenericForm
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={handleSubmit}
      fields={fields}
      breadcrumbItems={breadcrumbItems}
      onAssignMe={handleAssignMe}
    />
  );
};

export default CandidateEdit;
