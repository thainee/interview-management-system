import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import styles from './ActionModal.module.css';

const ActionModal = ({ show, onHide, onConfirm, domainName, action, actionText, variant = 'danger' }) => {
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title className={`${styles[`modalTitle-${variant}`]}`}>
                    Confirm {actionText}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBody}>
                Are you sure you want to {action} this {domainName}?
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>No</Button>
                <Button 
                    variant={variant} 
                    className={`${styles.confirmButton} ${styles[`confirmButton-${variant}`]}`} 
                    onClick={onConfirm}
                >
                    Yes
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ActionModal;