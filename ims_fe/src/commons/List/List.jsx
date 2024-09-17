import React from 'react';
import { Table, Container, Row, Col, Image } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PaginationComponent from '../../components/PaginationComponent';
import SearchbarComponent from '../../components/SearchbarComponent';
import BreadcrumbComponent from '../../components/BreadcrumbComponent';
import styles from './List.module.css';
import ResourceNotFound from '../ResourceNotFound/ResourceNotFound';

const List = ({
  items,
  columns,
  domainName,
  onSearch,
  onPageChange,
  onDeleteClick,
  searchDropdowns,
  currentPage,
  totalPages,
  onShowEditButton = () => true,
  onShowDeleteButton = () => true,
  showAddButton = true,
  formatters = {},
}) => {
  const renderCellContent = (item, column) => {
    const value = item[column.key];
    const formatter = formatters[column.key];

    if (Array.isArray(value)) {
      return value.map((v) => (formatter ? formatter(v) : v)).join(', ');
    }

    return formatter ? formatter(value) : value;
  };

  return (
    <Container className={styles.container}>
      <BreadcrumbComponent />
      <div className={styles.tableContainer}>
        <Row className={styles.searchContainer}>
          <Col>
            <SearchbarComponent
              onSearch={onSearch}
              dropdowns={searchDropdowns}
            />
          </Col>
          <Col xs={4} className='d-flex justify-content-end'>
            {showAddButton && (
              <Link
                to={`/${domainName}/create`}
                className={`d-block me-3 ${styles.addButton}`}
              >
                <Image src='/add.png' width={40} />
              </Link>
            )}
          </Col>
        </Row>
        <Table className={styles.table} hover>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>{column.header}</th>
              ))}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {items?.map((item, index) => (
              <tr key={index}>
                {columns.map((column) => (
                  <td key={column.key}>{renderCellContent(item, column)}</td>
                ))}
                <td>
                  <div className={styles.actionCell}>
                    <Link
                      to={`/${domainName}/${item.id}`}
                      className={styles.actionLink}
                    >
                      <Image src='/actions/view.png' width={16} />
                    </Link>
                    {onShowEditButton(item) && (
                      <Link
                        to={`/${domainName}/${item.id}/edit`}
                        className={styles.actionLink}
                      >
                        <Image src='/actions/edit.png' width={16} />
                      </Link>
                    )}
                    {onShowDeleteButton(item) && (
                      <Image
                        src='/actions/delete.png'
                        width={16}
                        className={styles.deleteButton}
                        onClick={() => onDeleteClick(item)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
        {!items.length ? (
          <ResourceNotFound />
        ) : (
          <div className={styles.paginationContainer}>
            <PaginationComponent
              onPageChange={onPageChange}
              totalPages={totalPages}
              currentPage={currentPage}
            />
          </div>
        )}
      </div>
    </Container>
  );
};

export default List;
