import { lazy } from 'react';

const LoginForm = lazy(() => import('../features/auth/LoginForm'));
const ForgotPassword = lazy(() => import('../features/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('../features/auth/ResetPassword'));

export const authRoutes = [
  {
    path: '/login',
    component: LoginForm,
    isPublic: true,
  },
  {
    path: '/forgot-password',
    component: ForgotPassword,
    isPublic: true,
  },
  {
    path: '/reset-password',
    component: ResetPassword,
    isPublic: true,
  },
];
