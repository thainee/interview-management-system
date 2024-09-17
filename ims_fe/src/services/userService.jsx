import api from './apiConfig';

export const fetchRecruiterOptions = async () => {
    try {
        const response = await api.get('/users/recruiters');
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const fetchUsers = async (page = 1, size = 10, searchTerm = '', role = '') => {
    try {
        const response = await api.get('/users', {
            params: {
                page: page - 1,
                size,
                searchTerm,
                role: role === 'Role' ? '' : role,
            }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const fetchUserById = async (id) => {
    try {
        const response = await api.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const createUser = async (formData) => {
    try {
        const response = await api.post('/users', formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateUser = async (formData) => {
    try {
        const id = formData.id;
        const response = await api.put(`/users/${id}`, formData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const changeUserStatus = async  (id,newStatus) =>{
    try{
        const response = await  api.put(`users/updateStatus/${id}`, {newStatus: newStatus});
        return response.data;
    }catch (error){
        throw error;
    }
};

