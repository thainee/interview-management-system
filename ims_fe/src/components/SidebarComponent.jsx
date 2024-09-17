import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import Image from 'react-bootstrap/Image';
import { Link, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setSidebarCollapsed } from '../store/uiSlice';
import { useEffect } from 'react';

const menuItems = [
  { path: '/home', icon: 'home.png', title: 'Homepage' },
  { path: '/candidates', icon: 'candidate.png', title: 'Candidate' },
  { path: '/jobs', icon: 'job.png', title: 'Job' },
  { path: '/schedules', icon: 'interview.png', title: 'Interview' },
  { path: '/offers', icon: 'offer.png', title: 'Offer' },
  { path: '/users', icon: 'user.png', title: 'User' },
];

function SidebarComponent() {
  const location = useLocation();
  const dispatch = useDispatch();
  const collapsedSidebarWidth = useSelector(
    (state) => state.ui.collapsedSidebarWidth
  );
  const expandedSidebarWidth = useSelector(
    (state) => state.ui.expandedSidebarWidth
  );
  const isSidebarCollapsed = useSelector(
    (state) => state.ui.isSidebarCollapsed
  );
  const navbarHeight = useSelector((state) => state.ui.navbarHeight);

  useEffect(() => {
    dispatch(setSidebarCollapsed(true));
  }, [dispatch]);

  const handleMouseEnter = () => {
    dispatch(setSidebarCollapsed(false));
  };

  const handleMouseLeave = () => {
    dispatch(setSidebarCollapsed(true));
  };

  const isActive = (path) => {
    return location.pathname.startsWith(path);
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        position: 'fixed',
        top: { navbarHeight },
        zIndex: 100,
      }}
    >
      <Sidebar
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        collapsed={isSidebarCollapsed}
        width={`${expandedSidebarWidth}px`}
        collapsedWidth={`${collapsedSidebarWidth}px`}
        backgroundColor='#fff'
      >
        <Menu
          menuItemStyles={{
            button: ({ level, active }) => {
              // only apply styles on first level elements of the tree
              if (level === 0)
                return {
                  color: '#44596e',
                  backgroundColor: active ? '#c5e4ff' : '#fff',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#c5e4ff',
                    color: '#000',
                  },
                };
            },
            icon: ({ level }) => {
              if (level === 0)
                return {
                  marginLeft: '10px',
                };
            },

            //make the label will be opacity 0 when collapsing with transition ease 0.3s
            label: ({ level }) => {
              if (level === 0)
                return {
                  transition: 'all 0.3s ease',
                  opacity: isSidebarCollapsed ? 0 : 1,
                  weight: isSidebarCollapsed ? 0 : '100%',
                  fontSize: '15px',
                };
            },
          }}
        >
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              icon={<Image src={`/sidebar-icons/${item.icon}`} width={24} />}
              component={<Link to={item.path} />}
              active={isActive(item.path)}
              className={`menu-item ${item.path === '/home' ? 'mt-3' : ''}`}
            >
              <span className='menu-item_title'>{item.title}</span>
            </MenuItem>
          ))}
        </Menu>
      </Sidebar>
    </div>
  );
}

export default SidebarComponent;
