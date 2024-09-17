import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from 'react-router-dom';
import {setPageInfo, setToast} from '../../store/uiSlice';
import Container from 'react-bootstrap/Container';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import {formatText} from '../../utils/formatUtils';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import '../../assets/css/styles.css';
import { getUserById, updateUserStatus } from '../../store/usersSlice';
import { format } from 'date-fns';
import Loading from '../../commons/Loading/Loading';
import ActionModal from "../../commons/ActionModal/ActionModal";

const UserView = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { id } = useParams();
    const user = useSelector((state) => state.users.currentUser);
    const status = useSelector((state) => state.users.status);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    useEffect(() => {
        dispatch(getUserById(id));
        dispatch(setPageInfo({ pageName: 'User', moduleName: 'User List', moduleLink: 'users', submoduleName: 'User Information' }));
    }, [dispatch, id]);


    if (status === 'loading') return <Loading />;

    if (status === 'failed') {
        return <div>Error loading user</div>;
    }

    if (!user) {
        return <div>No user found</div>;
    }


    const handleStatusChange = () => {
        setShowUpdateModal(true);

    };

    const handleUpdateConfirm = async () => {
        try {
            const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
            await dispatch(updateUserStatus({ userId: id, newStatus })).unwrap();
            dispatch(setToast({ type: 'success', message: 'User Status update successfully!' }));
            setShowUpdateModal(false);
        } catch (error) {
            dispatch(setToast({ type: 'error', message: 'Failed to update user status.' }));
        }
    };

    return (
        <Container>
            <BreadcrumbComponent>
                <Button onClick={handleStatusChange} variant={user.status === 'ACTIVE' ? 'danger':'success'}>{user.status === 'ACTIVE' ? 'Deactive':'Active'}</Button>
            </BreadcrumbComponent>
            <div style={{display: 'flex', justifyContent: 'flex-end'}}>
            </div>
            <div className='p-4 bg-white rounded-3'>
                <Row>
                    <Col md={6}>
                        <Row className="mb-3">
                            <Col md={4}><strong>Full Name:</strong></Col>
                                <Col md={8}>{user.fullName}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>D.O.B:</strong></Col>
                                <Col md={8}>{format(user.dob, "dd/MM/yyyy")}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Phone number:</strong></Col>
                                <Col md={8}>{user.phoneNumber}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Roles:</strong></Col>
                                <Col md={8}>{formatText(user.role)}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Status:</strong></Col>
                                <Col md={8}>{formatText(user.status)}</Col>
                            </Row>
                        </Col>
                        <Col md={6}>
                            <Row className="mb-3">
                                <Col md={4}><strong>Email:</strong></Col>
                                <Col md={8}>{user.email}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Address:</strong></Col>
                                <Col md={8}>{user.address}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Gender:</strong></Col>
                                <Col md={8}>{formatText(user.gender)}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Department:</strong></Col>
                                <Col md={8}>{formatText(user.department)}</Col>
                            </Row>
                            <Row className="mb-3">
                                <Col md={4}><strong>Note:</strong></Col>
                                <Col md={8}>{user.note}</Col>
                            </Row>
                        </Col>
                    </Row>

                    <div className='d-flex justify-content-center align-items-center mt-4'>
                        <Button variant="primary" onClick={() => navigate(`/users/${id}/edit`)}>
                            Edit
                        </Button>
                        <Button variant="secondary" className="ms-2" onClick={() => navigate(-1)}>
                            Go back
                        </Button>
                    </div>
                </div>
            <ActionModal
                show={showUpdateModal}
                onHide={() => setShowUpdateModal(false)}
                onConfirm={handleUpdateConfirm}
                domainName="users"
                action="updateStatus"
                actionText="Update"
                variant="danger"
            />
        </Container>
);
}

export default UserView;