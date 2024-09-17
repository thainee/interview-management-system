import { lazy } from 'react';
import { Navigate } from 'react-router-dom';

const Homepage = lazy(() => import('../components/Homepage'));
const PageNotFound = lazy(() => import('../commons/PageNotFound/PageNotFound'));

export const anotherRoutes = [
  {
    path: '/',
    component: () => <Navigate to='/home' replace />,
    allowedRoles: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'MANAGER'],
  },
  {
    path: '/home',
    component: Homepage,
    allowedRoles: ['ADMIN', 'RECRUITER', 'INTERVIEWER', 'MANAGER'],
  },
  {
    path: '*',
    component: PageNotFound,
    isPublic: true,
  },
];
