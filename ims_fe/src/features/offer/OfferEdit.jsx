import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { getOfferById, updateOfferById } from '../../store/offersSlice';
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
import { formatText } from '../../utils/formatUtils';
import { jwtDecode } from 'jwt-decode';

const OfferEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const offer = useSelector((state) => state.offers.currentOffer);
    const status = useSelector((state) => state.offers.status);
    const error = useSelector((state) => state.offers.error);

    useEffect(() => {
        dispatch(getOfferById(id));
    }, [dispatch, id]);

    useEffect(() => {
        if (status === 'failed') {
            dispatch(setToast({ type: 'error', message: error.message }));
        }
    }, [status, dispatch, error]);

    useEffect(() => {
        dispatch(setPageInfo({
            pageName: 'Offer',
            moduleName: 'Offer',
            moduleLink: 'offers',
            submoduleName: 'Edit Offer'
        }));
    }, [dispatch]);

    const { recruiterOptions, isLoading: isRecruitersLoading } = useRecruiterOptions();
    const { candidateOptions, isLoading: isCandidatesLoading } = useCandidateOptions();
    const { managerOptions, isLoading: isManagersLoading } = useManagerOptions();


    const isLoading = isRecruitersLoading || isCandidatesLoading || isManagersLoading;

    const schema = offerSchema;

    // const initialValues = {
    //     candidateId: offer.candidateId,
    //     contractType: offer.contractType,
    //     position: offer.position,
    //     level: offer.level,
    //     approvedById: offer.approvedById,
    //     department: offer.department,
    //     recruiterId: offer.recruiterId,
    //     contractFrom: offer.contractFrom,
    //     contractTo: offer.contractTo,
    //     dueDate: offer.dueDate,
    //     salary: offer.salary,
    //     note: offer.note,
    //     status: offer.status
    // };

    const initialValues = {
        candidateId: offer?.candidateId || '',
        candidateName: offer?.candidateName || '',  
        contractType: offer?.contractType || '',
        position: offer?.position || '',
        level: offer?.level || '',
        approvedById: Number(offer?.approvedById) || '',
        department: offer?.department || '',
        recruiterId: Number(offer?.recruiterId) || '',
        contractFrom: offer?.contractFrom || '',
        contractTo: offer?.contractTo || '',
        dueDate: offer?.dueDate || '',
        salary: offer?.salary || '',
        note: offer?.note || '',
        status: formatText(offer?.status) || ''
    };

    const fields = [
        {
            fields: [
                { name: 'candidateName', label: 'Candidate', type: 'disabled'},
                { name: 'contractType', label: 'Contract type', type: 'select', options: contractTypeOptions, required: true },
                { name: 'position', label: 'Position', type: 'select', options: positionOptions, required: true },
                { name: 'level', label: 'Level', type: 'select', options: levelOptions, required: true },
                { name: 'approvedById', label: 'Approved by', type: 'select',options: managerOptions, required: true },
                { name: 'department', label: 'Department', type: 'select', options: departmentFormOptions, required: true },
                { name: 'interviewInfo', label: 'Interview info', type: 'disabledTextarea' },
                { name: 'recruiterId', label: 'Recruiter Owner', type: 'select', options: recruiterOptions, required: true },
                { name: 'contractFrom', label: 'Contract from', type: 'date', required: true },
                { name: 'contractTo', label: 'Contract to', type: 'date', required: true },
                { name: 'dueDate', label: 'Due date', type: 'date', required: true },
                { name: 'interviewNote', label: 'Interview note', type: 'disabledTextarea' },
                { name: 'salary', label: 'Basic salary', type: 'number', required: true },
                { name: 'status', label: 'Status', type: 'disabled' },
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

            await dispatch(updateOfferById({ id, formData })).unwrap();
            dispatch(setToast({ type: 'success', message: 'Offer updated successfully!' }));
            navigate('/offers/');
        } catch (error) {
            const firstErrorMessage = Object.values(error)[0];
            dispatch(setToast({ type: 'error', message: firstErrorMessage }));
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

    if (status === 'loading' || isLoading) return <Loading />;
    if (status === 'failed') return <div>Error loading offer</div>;
    if (!offer) return <div>No offer found</div>;

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

export default OfferEdit;