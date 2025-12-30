const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

const getToken = () => {
  return localStorage.getItem('token');
};

// Get all blacklist with pagination and filters
export const getAllBlacklist = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.scamType) queryParams.append('scamType', params.scamType);
    if (params.dangerLevel) queryParams.append('dangerLevel', params.dangerLevel);
    if (params.search) queryParams.append('search', params.search);

    const response = await fetch(`${API_URL}/blacklist?${queryParams}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get blacklist');
    }

    return data;
  } catch (error) {
    console.error('Get blacklist error:', error);
    throw error;
  }
};

// Get blacklist by ID
export const getBlacklistById = async (id) => {
  try {
    const response = await fetch(`${API_URL}/blacklist/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get blacklist item');
    }

    return data;
  } catch (error) {
    console.error('Get blacklist by ID error:', error);
    throw error;
  }
};

// Create blacklist entry (Admin only)
export const createBlacklist = async (blacklistData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login as admin to create blacklist entry');
    }

    const response = await fetch(`${API_URL}/blacklist`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(blacklistData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create blacklist entry');
    }

    return data;
  } catch (error) {
    console.error('Create blacklist error:', error);
    throw error;
  }
};

// Update blacklist entry (Admin only)
export const updateBlacklist = async (id, updateData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login as admin to update blacklist entry');
    }

    const response = await fetch(`${API_URL}/blacklist/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to update blacklist entry');
    }

    return data;
  } catch (error) {
    console.error('Update blacklist error:', error);
    throw error;
  }
};

// Delete blacklist entry (Admin only)
export const deleteBlacklist = async (id) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login as admin to delete blacklist entry');
    }

    const response = await fetch(`${API_URL}/blacklist/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete blacklist entry');
    }

    return data;
  } catch (error) {
    console.error('Delete blacklist error:', error);
    throw error;
  }
};
