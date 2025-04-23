import axios from 'axios';


const API_BASE_URL = 'http://localhost:5029/api';

export const getAllGroups = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/Group/all`);
        console.log(response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching groups:', error);
        throw error; // Ném lại lỗi để xử lý ở nơi gọi
    }
};


export const getUsersByGroup = async (groupId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/User?groupId=${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error; // Ném lại lỗi để xử lý ở nơi gọi
    }
};

export async function getGroupTree() {
    const response = await axios.get(`${API_BASE_URL}/Group/tree`);
    return response.data;
};

export const createGroup=async (newGroup) => {
    try {
        const response=await axios.post(`${API_BASE_URL}/Group`, newGroup);
        return response.data;
    } catch (error) {
        console.error('Error creating group:', error);
        throw error;
    }
};

export const deleteGroup=async (groupId)=>{
    try {
        const response=await axios.delete(`${API_BASE_URL}/Group/${groupId}`);
    } catch (error) {
        console.error('Error deleting group:', error);
        throw error;
        
    }
}

export const updateGroup=async (groupId, updatedGroup)=>{
    try {
        const response=await axios.put(`${API_BASE_URL}/Group/${groupId}`, updatedGroup);
        return response.data;
    
        
    } catch (error) {
        console.error('Error updating group:', error);
        throw error;
    }
}

export const getGroupById=async (groupId)=>{
    try {
        const response=await axios.get(`${API_BASE_URL}/Group/${groupId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching group by ID:', error);
        throw error;
    }
}
