import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "reselect";
import { getCandidates } from "../store/offersSlice";
import { setToast } from "../store/uiSlice";

const selectCandidates = state => state.offers.candidates;

const selectCandidateOptions = createSelector(
    [selectCandidates],
    (candidates) => candidates.map(candidate => ({
        value: candidate.candidateId,
        label: candidate.candidateName,
        interviewInfo: candidate.interviewInfo,
        interviewNote: candidate.interviewNote
    }))
);

export const useCandidateOptions = () => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const candidateOptions = useSelector(selectCandidateOptions);

    useEffect(() => {
        const fetchData = async () => {
            try {
                await dispatch(getCandidates()).unwrap();
            } catch (error) {
                console.error("Failed to fetch candidates:", error);
                dispatch(setToast({ type: 'error', message: 'Failed to load candidates' }));
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [dispatch]);

    return { candidateOptions, isLoading };
}