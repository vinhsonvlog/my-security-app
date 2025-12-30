const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

const getToken = () => {
  return localStorage.getItem('token');
};

export const submitReport = async (reportData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login to submit a report');
    }

    const response = await fetch(`${API_URL}/reports`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(reportData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to submit report');
    }

    return data;
  } catch (error) {
    console.error('Submit report error:', error);
    throw error;
  }
};

export const getMyReports = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login to view your reports');
    }

    const response = await fetch(`${API_URL}/reports/my-reports`, {
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
    console.error('Get my reports error:', error);
    throw error;
  }
};

export const getAllReports = async () => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login to view reports');
    }

    const response = await fetch(`${API_URL}/reports/admin/all`, {
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

export const updateReportStatus = async (id, updateData) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login to update report');
    }

    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to update report');
    }

    return data;
  } catch (error) {
    console.error('Update report error:', error);
    throw error;
  }
};

export const deleteReport = async (id) => {
  try {
    const token = getToken();
    
    if (!token) {
      throw new Error('Please login to delete report');
    }

    const response = await fetch(`${API_URL}/reports/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Failed to delete report');
    }

    return data;
  } catch (error) {
    console.error('Delete report error:', error);
    throw error;
  }
};

// Create report (public - no authentication required)
export const createReport = async (reportData) => {
  try {
    const response = await fetch(`${API_URL}/reports/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reportData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to create report');
    }

    return data;
  } catch (error) {
    console.error('Create report error:', error);
    throw error;
  }
};

// Get report status by ID
export const getReportStatus = async (reportId) => {
  try {
    const response = await fetch(`${API_URL}/reports/status/${reportId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get report status');
    }

    return data;
  } catch (error) {
    console.error('Get report status error:', error);
    throw error;
  }
};

// Get user reports by email
export const getUserReports = async (email) => {
  try {
    const response = await fetch(`${API_URL}/reports/user?email=${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get user reports');
    }

    return data;
  } catch (error) {
    console.error('Get user reports error:', error);
    throw error;
  }
};

