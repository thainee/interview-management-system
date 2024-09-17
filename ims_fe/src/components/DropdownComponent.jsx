import React from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import '../assets/css/styles.css';
import { useDispatch } from 'react-redux';
import styles from './DropdownComponent.module.css';

function DropdownComponent({ title, options, selectedValue, actionCreator }) {
    const dispatch = useDispatch();

    const getSelectedLabel = () => {
        if (selectedValue === '') {
            return title;
        }
        const selectedOption = options.find(option => option.value === selectedValue);
        return selectedOption ? selectedOption.label : title;
    };

    return (
        <DropdownButton
            title={getSelectedLabel()}
            bsPrefix='width-190 bg-white border d-flex align-items-center justify-content-between px-3'
        >
            <div className={styles.scrollableMenu}>
                {options.map(option => (
                    <Dropdown.Item
                        key={option.value}
                        onClick={() => dispatch(actionCreator(option.value))}
                        className={styles.dropdownItem}
                    >
                        {option.label}
                    </Dropdown.Item>
                ))}
            </div>
        </DropdownButton>
    );
}

export default DropdownComponent;