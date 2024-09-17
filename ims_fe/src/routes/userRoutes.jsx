import {lazy} from 'react';

const UserView = lazy (() => import('../features/user/UserView'));
const UserList = lazy (() => import('../features/user/UserList'));
const UserCreate = lazy (() => import('../features/user/UserCreate'));
const UserEdit = lazy(() => import('../features/user/UserEdit'));

export const userRoutes = [
    {
        path:'/users',
        component:UserList,
        exact: true,
        allowedRoles: ['ADMIN'],
    },
    {
        path: '/users/:id',
        component: UserView,
        exact: true,
        allowedRoles: ['ADMIN'],
    },
    {
        path: '/users/create',
        component: UserCreate,
        allowedRoles: ['ADMIN'],
    },
    {
        path: '/users/:id/edit',
        component: UserEdit,
        allowedRoles: ['ADMIN'],
    },
]