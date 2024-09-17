import { jwtDecode } from 'jwt-decode';
import React from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';
import Unauthorized from '../commons/Unauthorized/Unauthorized';

const ContentLayout = ({ allowedRoles = [] }) => {
  const navbarHeight = useSelector((state) => state.ui.navbarHeight);
  const isSidebarCollapsed = useSelector(
    (state) => state.ui.isSidebarCollapsed
  );
  const collapsedSidebarWidth = useSelector(
    (state) => state.ui.collapsedSidebarWidth
  );
  const expandedSidebarWidth = useSelector(
    (state) => state.ui.expandedSidebarWidth
  );

  const navbarHeightCSS = `${navbarHeight}px`;
  const sidebarWidthCSS = isSidebarCollapsed
    ? `${collapsedSidebarWidth}px`
    : `${expandedSidebarWidth}px`;
  const widthCSS = `calc(100% - ${sidebarWidthCSS})`;
  const heightCSS = `calc(100% - ${navbarHeightCSS})`;
  const minHeightCSS = `calc(100vh - ${navbarHeightCSS})`;

  const token = localStorage.getItem('token');
  const { scope: userRole } = jwtDecode(token);
  const isAllowed = allowedRoles.includes(userRole);

  return (
    <div
      style={{
        marginLeft: sidebarWidthCSS,
        width: widthCSS,
        marginTop: navbarHeightCSS,
        height: heightCSS,
        minHeight: minHeightCSS,
        transition: 'all 0.3s ease',
      }}
    >
      {isAllowed ? <Outlet /> : <Unauthorized />}
    </div>
  );
};

export default ContentLayout;
