import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { clearToast } from '../store/uiSlice';

const ToastManager = () => {
    const dispatch = useDispatch();
    const toastData = useSelector(state => state.ui.toast);
    const toastShownRef = useRef(false);

    useEffect(() => {
        if (toastData && !toastShownRef.current) {
            toast[toastData.type](toastData.message, {
                onClose: () => {
                    dispatch(clearToast());
                    toastShownRef.current = false;
                }
            });
            toastShownRef.current = true;
        }
    }, [toastData, dispatch]);

    return <ToastContainer 
    className="mt-5"
    position="top-right"
    autoClose={3000} />;
};

export default ToastManager;