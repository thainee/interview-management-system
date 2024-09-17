import React, { useState, useEffect } from 'react';
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from 'react-router-dom';
import { setPageInfo, setToast } from '../../store/uiSlice';
import { getJobById, updateJobById } from '../../store/jobsSlice';
import GenericForm from '../../commons/GenericForm/GenericForm';
import {
    benefitOptions,
    levelOptions,
    skillOptions,
} from '../../utils/optionUtils';
import { jobSchema } from '../../utils/formYupValidation';
import { formatText } from '../../utils/formatUtils';
import Loading from '../../commons/Loading/Loading';
import {format} from "date-fns";
import { jwtDecode } from 'jwt-decode';


const JobEdit = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(setPageInfo({
            pageName: 'Job',
            moduleName: 'Job',
            moduleLink: 'jobs',
            submoduleName: 'Edit Job details',
        }));

        const fetchJob = async () => {
            try {
                const fetchedJob = await dispatch(getJobById(id)).unwrap();
                setJob(fetchedJob);
            } catch (error) {
                dispatch(setToast({ type: 'error', message: 'Error loading job' }));
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
    }, [dispatch, id]);

    if (loading) return <Loading />;
    if (!job) return <div>No job found</div>;

    const schema = jobSchema;
    const { userId: currentUserId } = jwtDecode(localStorage.getItem('token'));


    const initialValues = {
        title: job.title,
        skills: job.skills.map(value => ({ value: value, label: formatText(value) })),
        startDate: new Date(job.startDate),
        endDate: new Date(job.endDate),
        salaryFrom: job.salaryFrom,
        salaryTo: job.salaryTo,
        benefits: job.benefits.map(value => ({ value: value, label: formatText(value) })),
        address: job.address,
        levels: job.levels.map(value => ({ value: value, label: formatText(value) })),
        description: job.description,
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
        { text: 'Edit Job', active: true },
    ];


    const handleSubmit = async (values, setSubmitting) => {
        try {
            const skillValues = values.skills.map(value => value.value);
            const benefitValues = values.benefits.map(value => value.value);
            const levelValues = values.levels.map(value => value.value);
            const startDate = new Date(values.startDate)
            const endDate = new Date(values.endDate)

            const formData = {
                title: values.title,
                skills: skillValues,
                startDate: format(startDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
                endDate: format(endDate, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx"),
                salaryFrom: values.salaryFrom,
                salaryTo: values.salaryTo,
                benefits: benefitValues,
                address: values.address,
                levels: levelValues,
                description: values.description,
                updatedBy: currentUserId,
            };

            await dispatch(updateJobById({ id, formData })).unwrap();
            dispatch(setToast({ type: 'success', message: 'Job updated successfully!' }));
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

export default JobEdit;