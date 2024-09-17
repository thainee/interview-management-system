import api from './apiConfig';

export const fetchJobs = async (page = 1, size = 10, searchTerm = '', status = '') => {
    try {
        const response = await api.get('/jobs', {
            params: {
                page: page - 1,
                size,
                searchTerm,
                status: status === 'Status' ? '' : status,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchEditJobById = async (id) => {
    try {
        const response = await api.get(`/jobs/edit/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createJob = async (formData) => {
    try {
        const response = await api.post('/jobs', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateJob = async (id, formData) => {
    try {
        const response = await api.put(`/jobs/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeJobById = async (id) => {
    try {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};