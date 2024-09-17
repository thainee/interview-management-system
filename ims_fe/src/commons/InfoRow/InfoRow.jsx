import React from 'react';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import styles from './InfoRow.module.css';

const InfoRow = ({ label, value, valueClassName }) => (
    <Row className={styles.infoRow}>
        <Col md={4} className={styles.label}><strong>{label}:</strong></Col>
        <Col md={8} className={valueClassName}>{value}</Col>
    </Row>
);

export default InfoRow;