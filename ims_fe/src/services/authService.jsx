import api from './apiConfig';

export const createToken = async (formData) => {
    try {
        const response = await api.post('/auth/login', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logout = async () => {
    try {
        const token = localStorage.getItem('token');
        const response = await api.post('/auth/logout', null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        console.log("Logout API called: ", response);
        return response.data;
    } catch (error) {
        console.error("Error in logout API: ", error);
        throw error;
    }
};
export const forgotPassword = async (formData) => {
    try {
        const response = await api.post('/auth/forgot-password', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changePassword = async (formData) => {
    try {
        const response = await api.post('/auth/reset-password', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};