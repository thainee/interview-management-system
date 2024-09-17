import { lazy } from 'react';

const OfferList = lazy(() => import('../features/offer/OfferList'));
const OfferView = lazy(() => import('../features/offer/OfferView'));
const OfferEdit = lazy(() => import('../features/offer/OfferEdit'));
const OfferCreate = lazy(() => import('../features/offer/OfferCreate'));

export const offerRoutes = [
  {
    path: '/offers',
    component: OfferList,
    exact: true,
    allowedRoles: ['ADMIN','RECRUITER','MANAGER']
  },
  {
    path: '/offers/create',
    component: OfferCreate,
    allowedRoles: ['ADMIN','RECRUITER','MANAGER']
  },
  {
    path: '/offers/:id',
    component: OfferView,
    exact: true,
    allowedRoles: ['ADMIN','RECRUITER','MANAGER']
  },
  {
    path: '/offers/:id/edit',
    component: OfferEdit,
    allowedRoles: ['ADMIN','RECRUITER','MANAGER']
  },
];