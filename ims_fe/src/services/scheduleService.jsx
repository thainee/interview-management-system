import api from './apiConfig';

export const getAllInterviewers = async () => {
    try {
        const response = await api.get('/schedules/interviewers');
        return response.data;
    } catch (error) {
        console.error('Error fetching interviewers:', error);
        throw error;
    }
};

export const getAllCandidates = async () => {
    try {
        const response = await api.get('/schedules/candidates');
        return response.data;
    } catch (error) {
        console.error('Error fetching candidates:', error);
        throw error;
    }
};

export const fetchSchedules = async (page = 1, size = 10, searchTerm = '', interviewer = '', status = '') => {
    try {
        const response = await api.get('/schedules', {
            params: {
                page: page - 1,
                size,
                searchTerm,
                interviewer: interviewer === 'Interviewer' ? '' : interviewer,
                status: status === 'Status' ? '' : status,
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching schedules:', error);
        throw error;
    }
};

export const fetchScheduleById = async (id) => {
    try {
        const response = await api.get(`/schedules/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const sendReminderEmails = async (emails, id) => {
    try {
        const response = await api.post('/schedules/send-reminder', { emails, id });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createSchedule = async (formData) => {
    try {
        const response = await api.post('/schedules', formData, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
 
export const updateSchedule = async (formData) => {
    try {
        const id = formData.id;
        if (!id) {
            throw new Error('Schedule ID is undefined');
        }
        const response = await api.put(`/schedules/${id}/edit`, formData, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating schedule:', error);
        throw error;
    }
    
}
export const submitSchedule = async (formData) => {
    try {
        const id = formData.id;
        if (!id) {
            throw new Error('Schedule ID is undefined');
        }
        const response = await api.put(`/schedules/${id}/submit`, formData, {
            headers: {
                'Content-Type': 'application/json'
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting schedule:', error);
        throw error;
    }
    
}