import { lazy } from 'react';

const CandidateList = lazy(() => import('../features/candidate/CandidateList'));
const CandidateView = lazy(() => import('../features/candidate/CandidateView'));
const CandidateEdit = lazy(() => import('../features/candidate/CandidateEdit'));
const CandidateCreate = lazy(() =>
  import('../features/candidate/CandidateCreate')
);

export const candidateRoutes = [
  {
    path: '/candidates',
    component: CandidateList,
    exact: true,
    allowedRoles: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'MANAGER'],
  },
  {
    path: '/candidates/create',
    component: CandidateCreate,
    allowedRoles: ['ADMIN', 'RECRUITER', 'MANAGER'],
  },
  {
    path: '/candidates/:id',
    component: CandidateView,
    exact: true,
    allowedRoles: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'MANAGER'],
  },
  {
    path: '/candidates/:id/edit',
    component: CandidateEdit,
    allowedRoles: ['ADMIN', 'RECRUITER', 'MANAGER'],
  },
];
