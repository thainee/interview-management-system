import { lazy } from 'react';

const ScheduleList = lazy(() => import('../features/schedule/ScheduleList'));
const ScheduleDetail = lazy(() => import('../features/schedule/ScheduleDetail'));
const ScheduleCreate = lazy(() => import('../features/schedule/ScheduleCreate'));
const ScheduleEdit = lazy(() => import('../features/schedule/ScheduleEdit'));
const ScheduleSubmit = lazy(() => import('../features/schedule/ScheduleSubmit'));

export const scheduleRoutes = [
  {
    path: '/schedules',
    component: ScheduleList,
    exact: true,
    allowedRoles: ['ADMIN', 'MANAGER', 'RECRUITER', 'INTERVIEWER'],
  },
  {
    path: '/schedules/:id',
    component: ScheduleDetail,
    exact: true,
    allowedRoles: ['ADMIN', 'MANAGER', 'RECRUITER', 'INTERVIEWER'],
  },
  {
    path: '/schedules/create',
    component: ScheduleCreate,
    allowedRoles: ['ADMIN', 'MANAGER', 'RECRUITER'],
  },
  {
    path: '/schedules/:id/edit',
    component: ScheduleEdit,
    allowedRoles: ['ADMIN', 'MANAGER', 'RECRUITER'],
  },
  {
    path: '/schedules/:id/submit',
    component: ScheduleSubmit,
    allowedRoles: ['INTERVIEWER'],
  },
];
