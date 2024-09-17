import React, {useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {useNavigate, useLocation} from 'react-router-dom';
import {Link} from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image';
import PaginationComponent from '../../components/PaginationComponent';
import SearchbarComponent from '../../components/SearchbarComponent';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import {getUsers} from '../../store/usersSlice';
import {setPageInfo} from '../../store/uiSlice';
import {formatText} from '../../utils/formatUtils';
import {userRoleOptions} from '../../utils/optionUtils';
import {setSearchRole} from '../../store/filterSlice';
import Loading from '../../commons/Loading/Loading';

const UserList = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const Users = useSelector((state) => state.users.list);
    const status = useSelector((state) => state.users.status);
    const error = useSelector((state) => state.users.error);
    const searchTerm = useSelector((state) => state.filter.searchTerm);
    const selectedRole = useSelector((state) => state.filter.searchRole);
    const currentPage = useSelector(state => state.users.currentPage);
    const totalPages = useSelector(state => state.users.totalPages);

    useEffect(() => {
        dispatch(setPageInfo({pageName: 'User', moduleName: 'User', moduleLink: 'users', submoduleName: 'User List'}));

        const params = new URLSearchParams(location.search);
        const page = parseInt(params.get('page') || '1');
        const size = parseInt(params.get('size') || '10');
        const term = params.get('searchTerm') || '';
        const role = params.get('role') || '';

        dispatch(getUsers({page, size, searchTerm: term, role}));

    }, [dispatch, location.search]);

    const handleSearch = (term) => {
        const searchParams = new URLSearchParams();
        if (term) searchParams.set('searchTerm', term)
        else if (searchTerm) searchParams.set('searchTerm', searchTerm);
        if (selectedRole && selectedRole !== 'Role') searchParams.set('role', selectedRole);

        navigate(`/users?${searchParams.toString()}`);
    };

    const handlePageChange = (page) => {
        const searchParams = new URLSearchParams(location.search);
        searchParams.set('page', page.toString());
        navigate(`/users?${searchParams.toString()}`);
    };


    if (status === 'loading') return <Loading />;

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <Container>
            <BreadcrumbComponent/>
            <div className='p-4 bg-white rounded-3'>
                <Row className='mt-3'>
                    <Col>
                        <SearchbarComponent
                            onSearch={handleSearch}
                            dropdowns={[
                                {
                                    title: 'Role',
                                    options: userRoleOptions,
                                    selectedValue: selectedRole,
                                    actionCreator: setSearchRole
                                }
                            ]}
                        />
                    </Col>
                    <Col xs={4} className='d-flex justify-content-end'>
                        <Link to="/users/create" className='d-block me-3' style={{width: '50px', height: '50px'}}>
                            <Image src="add.png" width={40}/>
                        </Link>
                    </Col>
                </Row>
                <Table className='mb-5 mt-4' hover>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Phone No.</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Users.map((user, index) => (
                        <tr key={index}>
                            <td>{user.userName}</td>
                            <td>{user.email}</td>
                            <td>{user.phoneNumber}</td>
                            <td>{formatText(user.role)}</td>
                            <td>{formatText(user.status)}</td>
                            <td>
                                <div className='d-flex align-items-center'>
                                    <Link to={`/users/${user.id}`} className='me-3'>
                                        <Image src="/actions/view.png" width={16}/>
                                    </Link>
                                    <Link to={`/users/${user.id}/edit`}>
                                        <Image src="/actions/edit.png" width={16} className=''/>
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <PaginationComponent onPageChange={handlePageChange} totalPages={totalPages} currentPage={currentPage}/>
            </div>
        </Container>
    );
};

export default UserList;
