import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { createNewOffer } from '../../store/offersSlice';
import GenericForm from '../../commons/GenericForm/GenericForm';
import {
    positionOptions,
    contractTypeOptions,
    levelOptions,
    departmentFormOptions,
} from '../../utils/optionUtils';
import { offerSchema } from '../../utils/formYupValidation';
import Loading from '../../commons/Loading/Loading';
import { useRecruiterOptions } from '../../hooks/useRecruiterOptions';
import { useCandidateOptions } from '../../hooks/useCandidateOptions';
import { useManagerOptions } from '../../hooks/useManagerOptions';
import { jwtDecode } from 'jwt-decode';

const OfferCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();


    useEffect(() => {
        dispatch(setPageInfo({
            pageName: 'Offer',
            moduleName: 'Offer',
            moduleLink: 'offers',
            submoduleName: 'Create Offer'
        }));
    }, [dispatch]);

    const { recruiterOptions, isLoading: isRecruitersLoading } = useRecruiterOptions();
    const { candidateOptions, isLoading: isCandidatesLoading } = useCandidateOptions();
    const { managerOptions, isLoading: isManagersLoading } = useManagerOptions();


    const isLoading = isRecruitersLoading || isCandidatesLoading || isManagersLoading;

    const schema = offerSchema;

    const initialValues = {
        candidateId: '',
        contractType: '',
        position: '',
        level: '',
        approvedById: '',
        department: '',
        recruiterId: '',
        contractFrom: '',
        contractTo: '',
        dueDate: '',
        salary: '',
        note: '',
    };

    const fields = [
        {
            fields: [
                { name: 'candidateId', label: 'Candidate', type: 'select', options: candidateOptions, required: true },
                { name: 'contractType', label: 'Contract type', type: 'select', options: contractTypeOptions, required: true },
                { name: 'position', label: 'Position', type: 'select', options: positionOptions, required: true },
                { name: 'level', label: 'Level', type: 'select', options: levelOptions, required: true },
                { name: 'approvedById', label: 'Approved by', type: 'select', options: managerOptions, required: true },
                { name: 'department', label: 'Department', type: 'select', options: departmentFormOptions, required: true },
                { name: 'interviewInfo', label: 'Interview info', type: 'disabled' },
                { name: 'recruiterId', label: 'Recruiter Owner', type: 'select', options: recruiterOptions, required: true },
                { name: 'contractFrom', label: 'Contract from', type: 'date', required: true },
                { name: 'contractTo', label: 'Contract to', type: 'date', required: true },
                { name: 'dueDate', label: 'Due date', type: 'date', required: true },
                { name: 'interviewNote', label: 'Interview note', type: 'disabled' },
                { name: 'salary', label: 'Basic salary', type: 'number', required: true },
                { name: 'note', label: 'Note', type: 'textarea' },
            ],
        },
    ];

    const breadcrumbItems = [
        { text: 'Offer', link: '/offers' },
        { text: 'Create Offer', active: true },
    ];

    const { userId: currentUserId } = jwtDecode(localStorage.getItem('token'));
    
    const handleAssignMe = (setFieldValue) => {
        setFieldValue('recruiterId', currentUserId);
    };

    const handleSubmit = async (values, setSubmitting) => {
        try {
            const formData = {
                ...values,
                updatedBy: currentUserId
            };

            console.log(formData);

            await dispatch(createNewOffer(formData)).unwrap();
            dispatch(setToast({ type: 'success', message: 'Offer created successfully!' }));
            navigate('/offers/');
        } catch (error) {
            console.log(error);
            const firstErrorMessage = Object.values(error)[0];
            dispatch(setToast({ type: 'error', message: error.message }));

        } finally {
            setSubmitting(false);
        }
    };

    const handleCandidateChange = (candidateId, setFieldValue) => {
        const selectedCandidate = candidateOptions.find(option => option.value === candidateId);
        if (selectedCandidate) {
            setFieldValue('interviewInfo', selectedCandidate.interviewInfo || '');
            setFieldValue('interviewNote', selectedCandidate.interviewNote || '');
        } else {
            setFieldValue('interviewInfo', '');
            setFieldValue('interviewNote', '');
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
            onCandidateChange={handleCandidateChange}
        />
    );
};

export default OfferCreate;