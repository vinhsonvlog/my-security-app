const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

const getToken = () => {
  return localStorage.getItem('token');
};

export const getPendingReports = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/admin/reports/pending`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get pending reports');
    }

    return data;
  } catch (error) {
    console.error('Get pending reports error:', error);
    throw error;
  }
};

export const getAllReports = async (status = null) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const url = status 
      ? `${API_URL}/admin/reports?status=${status}`
      : `${API_URL}/admin/reports`;

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get reports');
    }

    return data;
  } catch (error) {
    console.error('Get all reports error:', error);
    throw error;
  }
};

export const approveReport = async (reportId, approvalData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/admin/reports/${reportId}/approve`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(approvalData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to approve report');
    }

    return data;
  } catch (error) {
    console.error('Approve report error:', error);
    throw error;
  }
};

export const rejectReport = async (reportId, rejectionData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/admin/reports/${reportId}/reject`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(rejectionData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to reject report');
    }

    return data;
  } catch (error) {
    console.error('Reject report error:', error);
    throw error;
  }
};

export const getBlacklist = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/admin/blacklist`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to get blacklist');
    }

    return data;
  } catch (error) {
    console.error('Get blacklist error:', error);
    throw error;
  }
};

export const removeFromBlacklist = async (blacklistId) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Authentication required');
    }

    const response = await fetch(`${API_URL}/admin/blacklist/${blacklistId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to remove from blacklist');
    }

    return data;
  } catch (error) {
    console.error('Remove from blacklist error:', error);
    throw error;
  }
};
