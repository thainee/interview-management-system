import api from './apiConfig';

export const fetchCandidates = async (page = 1, size = 10, searchTerm = '', status = '') => {
    try {
        const response = await api.get('/candidates', {
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

export const fetchCandidateById = async (id) => {
    try {
        const response = await api.get(`/candidates/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchEditCandidateById = async (id) => {
    try {
        const response = await api.get(`/candidates/edit/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createCandidate = async (formData) => {
    try {
        const response = await api.post('/candidates', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateCandidate = async (id, formData) => {
    try {
        const response = await api.put(`/candidates/${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const removeCandidateById = async (id) => {
    try {
        const response = await api.delete(`/candidates/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const banCandidate = async (id) => {
    try {
        const response = await api.put(`/candidates/${id}/ban`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchRecruiters = async () => {
    try {
        const response = await api.get('/users/recruiters');
        return response.data;
    } catch (error) {
        throw error;
    }
};