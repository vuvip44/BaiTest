
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5029/api';

export const getUsersByGroup = async (groupId) => {
    const response = await axios.get(`${API_BASE_URL}/User?groupId=${groupId}`);
    return response.data;
    console.log("User data:", response.data); // Log the user data
};

export const getUserById=async (userId)=>{
    const response=await axios.get(`${API_BASE_URL}/User/${userId}`);
    return response.data;
};

export const createUser = async (newUser) => {
    const response = await axios.post(`${API_BASE_URL}/User`, newUser);
    return response.data;
};

export const updateUser = async (userId, updatedUser) => {
    const response = await axios.put(`${API_BASE_URL}/User/${userId}`, updatedUser);
    return response.data;
};

export const deleteUser = async (userId) => {
    await axios.delete(`${API_BASE_URL}/User/${userId}`);
}
