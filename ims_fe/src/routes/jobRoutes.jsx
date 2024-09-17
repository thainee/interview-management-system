import { lazy } from 'react';

const JobList = lazy(() => import('../features/job/JobList'));
const JobView = lazy(() => import('../features/job/JobView'));
const JobCreate = lazy(() => import('../features/job/JobCreate'));
const JobEdit = lazy(() => import('../features/job/JobEdit'));

export const jobRoutes = [
    {
        path: '/jobs',
        component: JobList,
        exact: true,
        allowedRoles: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'MANAGER'],

    },
    {
        path: '/jobs/:id',
        component: JobView,
        exact: true,
        allowedRoles: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'MANAGER'],

    },
    {
        path: '/jobs/create',
        component: JobCreate,
        allowedRoles: ['ADMIN', 'RECRUITER', 'MANAGER'],

    },
    {
        path: '/jobs/:id/edit',
        component: JobEdit,
        allowedRoles: ['ADMIN', 'RECRUITER', 'MANAGER'],

    },
]