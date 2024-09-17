import React, { useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { createNewJob } from '../../store/jobsSlice';
import GenericForm from '../../commons/GenericForm/GenericForm';
import {
    skillOptions,
    benefitOptions,
    levelOptions
} from '../../utils/optionUtils';
import { jobSchema } from '../../utils/formYupValidation';

const JobCreate = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(setPageInfo({
            pageName: 'Job',
            moduleName: 'Job',
            moduleLink: 'jobs',
            submoduleName: 'Create Job'
        }));
    }, [dispatch]);

    const schema = jobSchema;

    const initialValues = {
        title: '',
        skills: [],
        startDate: '',
        endDate: '',
        salaryFrom: '0',
        salaryTo: '',
        benefits: [],
        address: '',
        levels: [],
        description: '',
    };

    const fields = [
        {
            fields: [
                { name: 'title', label: 'Job title', type: 'text', required: true },
                { name: 'skills', label: 'Skills', type: 'multiSelect', options: skillOptions, required: true },
                { name: 'startDate', label: 'Start date', type: 'date', required: true },
                { name: 'endDate', label: 'End date', type: 'date', required: true },
                { name: 'salaryFrom', label: 'Salary from', type: 'number' },
                { name: 'salaryTo', label: 'Salary to', type: 'number', required: true },
                { name: 'benefits', label: 'Benefits', type: 'multiSelect',  options: benefitOptions, required: true },
                { name: 'address', label: 'Working address', type: 'text', required: true },
                { name: 'levels', label: 'Levels', type: 'multiSelect',  options: levelOptions, required: true },
                { name: 'description', label: 'Description', type: 'textarea' },
            ],
        },
    ];

    const breadcrumbItems = [
        { text: 'Job', link: '/jobs' },
        { text: 'Create Job', active: true },
    ];

    const currentUserId = 1; // Replace with actual current user ID from your auth system

    const handleSubmit = async (values, setSubmitting) => {
        try {

            // Convert skills array to string array of skill values
            const skillValues = values.skills.map(value => value.value);
            const benefitValues = values.benefits.map(value => value.value);
            const levelValues = values.levels.map(value => value.value);

            // Create jobData object
            const formData = {
                title: values.title,
                skills: skillValues,
                startDate: values.startDate,
                endDate: values.endDate,
                salaryFrom: values.salaryFrom,
                salaryTo: values.salaryTo,
                benefits: benefitValues,
                address: values.address,
                levels: levelValues,
                description: values.description,
                updatedBy: currentUserId,
            };

            await dispatch(createNewJob(formData)).unwrap();
            dispatch(setToast({ type: 'success', message: 'Job created successfully!' }));
            navigate('/jobs/');
        } catch (error) {
            console.error(error);
            let errorMessage = 'An error occurred while updating the job';
            if (error.detail) {
                errorMessage = error.detail;
            } else if (typeof error === 'object' && Object.values(error).length > 0) {
                errorMessage = Object.values(error)[0];
            }
            dispatch(setToast({ type: 'error', message: errorMessage }));
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
            cancelLink="/jobs"
            breadcrumbItems={breadcrumbItems}
        />
    );
};

export default JobCreate;
