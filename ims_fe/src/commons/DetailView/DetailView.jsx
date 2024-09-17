import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Badge from 'react-bootstrap/Badge';
import InfoRow from '../InfoRow/InfoRow';
import { formatText, formatDate } from '../../utils/formatUtils';
import styles from './DetailView.module.css';


const DetailView = ({
  item,
  sections,
  editLink,
  showEditButton = true,
}) => {
  const navigate = useNavigate();

  const isUpdatedToday = () => {
    const today = new Date().toDateString();
    const updateDate = new Date(item?.updatedAt).toDateString();
    return today === updateDate;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.metaInfo}>
          Created on {formatDate(item.createdAt)}, last updated by{' '}
          {item.updatedBy}{' '}
          {isUpdatedToday() ? 'today' : `on ${formatDate(item.updatedAt)}`}
        </div>

        {sections.map((section, sectionIndex) => (
          <React.Fragment key={sectionIndex}>
            {section.title && (
              <h6 className={styles.sectionTitle}>{section.title}</h6>
            )}
            <Row>
              {section.columns.map((column, columnIndex) => (
                <Col md={6} key={columnIndex}>
                  {column.map((field, fieldIndex) => (
                    <InfoRow
                      key={fieldIndex}
                      label={field.label}
                      value={
                        field.type === 'array' ? (
                          field.value?.map((val, index) => (
                            <Badge
                              bg='secondary'
                              className={styles.badge}
                              key={index}
                            >
                              {formatText(val)}
                            </Badge>
                          ))
                        ) : field.type === 'link' ? (
                          <a
                            href={field.value}
                            className={styles.link}
                            download
                            target='_blank'
                            rel='noreferrer'
                          >
                            {field.displayValue || field.value}
                          </a>
                        ) : field.type === 'date' ? (
                          formatDate(field.value)
                        ) : field.type === 'enum' ? (
                          formatText(field.value)
                        ) : (
                          field.value
                        )
                      }
                      valueClassName={field.valueClassName}
                    />
                  ))}
                </Col>
              ))}
            </Row>
          </React.Fragment>
        ))}

        <div className={styles.buttonContainer}>
          {showEditButton && (
            <Button
              variant='primary'
              className={styles.editButton}
              onClick={() => navigate(editLink)}
            >
              Edit
            </Button>
          )}
          <Button variant='secondary' onClick={() => navigate(-1)}>
            Go back
          </Button>
        </div>
      </div>
    </>
  );
};

export default DetailView;
