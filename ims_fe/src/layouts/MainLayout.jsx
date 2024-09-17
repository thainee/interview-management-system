import React from 'react';
import NavbarComponent from '../components/NavbarComponent';
import SidebarComponent from '../components/SidebarComponent';


const MainLayout = ({children}) => {

    return (
        <div style={{ backgroundColor: '#f5f6f8' }}>
            {/* fixed position */}
            <NavbarComponent />
            {/* fixed position */}
            <SidebarComponent />
            {children}
        </div>
    );
};

export default MainLayout;