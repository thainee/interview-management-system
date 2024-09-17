import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getManagers } from "../store/offersSlice";
import { setToast } from "../store/uiSlice";

const selectManagers = state => state.offers.managers;

const selectManagerOptions = createSelector(
    [selectManagers],
    (managers) => managers.map(manager => ({
        value: manager.id,
        label: manager.displayName
    }))
);

export const useManagerOptions = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const managerOptions = useSelector(selectManagerOptions);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getManagers()).unwrap();
            } catch (error) {
                console.error("Failed to fetch managers:", error);
                dispatch(setToast({ type: 'error', message: 'Failed to load managers' }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    return { managerOptions, isLoading };
}