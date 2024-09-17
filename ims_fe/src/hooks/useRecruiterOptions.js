import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getRecruiters } from "../store/candidatesSlice";
import { setToast } from "../store/uiSlice";

const selectRecruiters = state => state.candidates.recruiters;

const selectRecruiterOptions = createSelector(
    [selectRecruiters],
    (recruiters) => recruiters.map(recruiter => ({
        value: recruiter.id,
        label: recruiter.displayName
    }))
);

export const useRecruiterOptions = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const recruiterOptions = useSelector(selectRecruiterOptions);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getRecruiters()).unwrap();
            } catch (error) {
                console.error("Failed to fetch recruiters:", error);
                dispatch(setToast({ type: 'error', message: 'Failed to load recruiters' }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    return { recruiterOptions, isLoading };
}