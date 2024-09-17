import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { routes } from './routeConfig';
import Loading from '../commons/Loading/Loading';

const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      {routes.map((route, index) =>
        route.isPublic ? (
          <Route key={index} path={route.path} element={<route.component />} />
        ) : (
          <Route
            key={index}
            element={<ProtectedRoute allowedRoles={route.allowedRoles} />}
          >
            <Route path={route.path} element={<route.component />} />
          </Route>
        )
      )}
    </Routes>
  </Suspense>
);

export default AppRoutes;
