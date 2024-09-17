import api from './apiConfig';

export const fetchOffers = async (page = 1, size = 10, searchTerm = '', status = '', department = '') => {
    try {
        const response = await api.get('/offers', {
            params: {
                page: page - 1,
                size,
                searchTerm,
                status: status === 'Status' ? '' : status,
                department: department === 'Department' ? '' : department,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchOfferById = async (id) => {
    try {
        const response = await api.get(`/offers/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createOffer = async (formData) => {
    try {
        const response = await api.post('/offers', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateOffer = async (id, formData) => {
    try {
        const response = await api.put(`/offers/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const approveOffer = async (id) => {
    try {
        const response = await api.put(`/offers/approve/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const rejectOffer = async (id) => {
    try {
        const response = await api.put(`/offers/reject/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const sentOffer = async (id) => {
    try {
        const response = await api.put(`/offers/sent/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const acceptOffer = async (id) => {
    try {
        const response = await api.put(`/offers/accept/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const declineOffer = async (id) => {
    try {
        const response = await api.put(`/offers/decline/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const cancelOffer = async (id) => {
    try {
        const response = await api.put(`/offers/cancel/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchCandidates = async () => {
    try {
        const response = await api.get('/offers/candidates');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const fetchManagers = async () => {
    try {
        const response = await api.get('/offers/managers');
        return response.data;
    } catch (error) {
        throw error;
    }
};