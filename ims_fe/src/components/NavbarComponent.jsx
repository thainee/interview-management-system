import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Image from 'react-bootstrap/Image';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../services/authService';
import { setToast } from '../store/uiSlice';
import { jwtDecode } from 'jwt-decode';
import { formatText } from '../utils/formatUtils';

function NavbarComponent() {
    const navbarHeight = useSelector((state) => state.ui.navbarHeight);
    const pageName = useSelector((state) => state.ui.pageName);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { username, department } = jwtDecode(localStorage.getItem('token'));

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem('token');
            navigate('/login'); // Chuyển hướng đến trang login
        } catch (error) {
            dispatch(setToast({ type: 'error', message: error.message }));
        }
    };

    return (
        <Navbar
            style={{
                height: `${navbarHeight}px`,
                backgroundColor: '#39434C',
                color: '#fff',
                '--bs-navbar-color': '#fff',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
            }}
            variant='dark'
            expand='lg'
        >
            <Container fluid className='mx-4'>
                <Navbar.Brand
                    as={Link}
                    to='/home'
                    className='d-flex align-items-center justify-content-center'
                    style={{ cursor: 'pointer' }}
                >
                    <Image
                        src='/dev.png'
                        width={40}
                        //make image color to white
                        style={{
                            filter: 'brightness(0) invert(1)',
                        }}
                    />
                    <span style={{ fontSize: '22px' }} className='fw-bolder ms-2'>
            IMS
          </span>
                </Navbar.Brand>
                <Navbar.Brand className='fw-semibold ms-4' style={{ fontSize: '21px' }}>
                    {pageName}
                </Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className='justify-content-end'>
                    <Navbar.Text
                        className='d-flex flex-column justify-content-center align-items-center'
                        style={{ fontSize: '15px' }}
                    >
                        <div className='fw-medium'>{username}</div>
                        <div>{formatText(department)}</div>
                    </Navbar.Text>
                    <Navbar.Text className='mx-4'>
                        <Image
                            src='/user.png'
                            width={40}
                            rounded
                            style={{
                                filter: 'brightness(0) invert(1)',
                            }}
                        />
                    </Navbar.Text>
                    <Nav.Item>
                        <Nav.Link
                            as='a'
                            eventKey='logout'
                            style={{
                                transition: 'text-decoration 0.3s',
                                cursor: 'pointer',
                            }}
                            onMouseEnter={(e) =>
                                (e.target.style.textDecoration = 'underline')
                            }
                            onMouseLeave={(e) => (e.target.style.textDecoration = 'none')}
                            onClick={handleLogout} // Thêm onClick để xử lý logout
                        >
                            Logout
                        </Nav.Link>
                    </Nav.Item>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavbarComponent;
