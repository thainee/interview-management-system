import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { createNewCandidate } from '../../store/candidatesSlice';
import GenericForm from '../../commons/GenericForm/GenericForm';
import {
  skillOptions,
  genderOptions,
  highestLevelOptions,
  positionOptions,
} from '../../utils/optionUtils';
import { candidateSchema } from '../../utils/formYupValidation';
import Loading from '../../commons/Loading/Loading';
import { useRecruiterOptions } from '../../hooks/useRecruiterOptions';
import { jwtDecode } from 'jwt-decode';

const CandidateCreate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(
      setPageInfo({
        pageName: 'Candidate',
        moduleName: 'Candidate',
        moduleLink: 'candidates',
        submoduleName: 'Create Candidate',
      })
    );
  }, [dispatch]);

  const { recruiterOptions, isLoading } = useRecruiterOptions();

  const schema = candidateSchema;

  const initialValues = {
    fullName: '',
    email: '',
    gender: '',
    dob: '',
    address: '',
    phoneNumber: '',
    cv: null,
    currentPosition: '',
    skills: [],
    experience: '',
    highestLevel: '',
    recruiterId: '',
    note: '',
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
        status: values.status,
        position: values.currentPosition,
        skills: skillValues,
        experience:
          values.experience === '' ? null : parseInt(values.experience),
        highestLevel: values.highestLevel,
        recruiterId: values.recruiterId,
        note: values.note,
        updatedBy: currentUserId,
      };

      // Append candidateData as JSON string
      formData.append(
        'candidateRequestDto',
        new Blob([JSON.stringify(candidateData)], { type: 'application/json' })
      );

      // Append CV file
      formData.append('cv', values.cv);

      await dispatch(createNewCandidate(formData)).unwrap();
      dispatch(
        setToast({
          type: 'success',
          message: 'Candidate created successfully!',
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

  if (isLoading) {
    return <Loading />;
  }

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

export default CandidateCreate;
