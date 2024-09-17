import Pagination from 'react-bootstrap/Pagination';

function PaginationComponent({ onPageChange, totalPages, currentPage }) {
    currentPage = currentPage || 1;
    totalPages = totalPages || 1;

    let items = [];
    if (currentPage - 2 > 1) items.push(<Pagination.Ellipsis key='el1' />)
    for (let number = currentPage - 2; number <= currentPage + 2; number++) {
        if (number > 0 && number <= totalPages) {
            items.push(
                <Pagination.Item key={number} active={number === currentPage}
                    onClick={() => number !== currentPage ? onPageChange(number) : null}
                >
                    {number}
                </Pagination.Item>
            );
        }
    }
    if (currentPage + 2 < totalPages) items.push(<Pagination.Ellipsis key='el2' />)

    return (
        <Pagination className='justify-content-center'>
            <Pagination.First onClick={() => onPageChange(1)} disabled={currentPage === 1} />
            <Pagination.Prev onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} />
            {items}
            <Pagination.Next onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            <Pagination.Last onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages} />
        </Pagination>
    );
}

export default PaginationComponent;