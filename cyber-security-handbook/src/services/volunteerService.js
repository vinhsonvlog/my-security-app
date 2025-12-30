import axios from 'axios';

const API_URL = 'http://localhost:1124/api/volunteers';

// Get token from localStorage
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

// Create volunteer registration (Public)
export const createVolunteer = async (volunteerData) => {
  try {
    const response = await axios.post(API_URL, volunteerData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi đăng ký' };
  }
};

// Get all volunteers (Admin only)
export const getAllVolunteers = async (params = {}) => {
  try {
    const response = await axios.get(API_URL, {
      ...getAuthHeaders(),
      params
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi lấy danh sách' };
  }
};

// Get single volunteer (Admin only)
export const getVolunteer = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra' };
  }
};

// Update volunteer (Admin only)
export const updateVolunteer = async (id, updateData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updateData, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi cập nhật' };
  }
};

// Delete volunteer (Admin only)
export const deleteVolunteer = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Có lỗi xảy ra khi xóa' };
  }
};
