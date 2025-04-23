
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5029/api';

export const getAllGroups = async () => {
    const response = await axios.get(`${API_BASE_URL}/Group/all`);
    return response.data;
};

export const getGroupTree = async () => {
    const response = await axios.get(`${API_BASE_URL}/Group/tree`);
    return response.data;
};

export const createGroup = async (newGroup) => {
    const response = await axios.post(`${API_BASE_URL}/Group`, newGroup);
    return response.data;
};

export const deleteGroup = async (groupId) => {
    await axios.delete(`${API_BASE_URL}/Group/${groupId}`);
};

export const updateGroup = async (groupId, updatedGroup) => {
    const response = await axios.put(`${API_BASE_URL}/Group/${groupId}`, updatedGroup);
    return response.data;
};

export const getGroupById = async (groupId) => {
    const response = await axios.get(`${API_BASE_URL}/Group/${groupId}`);
    return response.data;
};
