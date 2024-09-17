import React, { memo, useState } from 'react';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Button from 'react-bootstrap/Button';
import DropdownComponent from './DropdownComponent';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm } from '../store/filterSlice';

function SearchbarComponent({ onSearch, dropdowns }) {
    const dispatch = useDispatch();
    const searchTerm = useSelector(state => state.filter.searchTerm);
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleSearch = () => {
        dispatch(setSearchTerm(localSearchTerm.trim()));
        onSearch(localSearchTerm.trim());
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    }

    return (
        <InputGroup className="mb-3">
            <Form.Control
                type="text"
                placeholder="Search..."
                id="searchTerm"
                onKeyDown={handleKeyDown}
                onChange={(e) => setLocalSearchTerm(e.target.value)}
                defaultValue={searchTerm}
            />

            {dropdowns.map((dropdown, index) => (
                <DropdownComponent
                    key={index}
                    title={dropdown.title}
                    options={dropdown.options}
                    selectedValue={dropdown.selectedValue}
                    actionCreator={dropdown.actionCreator}
                />
            ))}

            <Button variant="primary" onClick={handleSearch}>
                Search
            </Button>
        </InputGroup>
    );
}

export default memo(SearchbarComponent);