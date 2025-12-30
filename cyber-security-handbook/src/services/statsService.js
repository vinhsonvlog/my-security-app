const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

// Get statistics
export const getStatistics = async () => {
  try {
    const response = await fetch(`${API_URL}/stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get statistics');
    }

    return data;
  } catch (error) {
    console.error('Get statistics error:', error);
    throw error;
  }
};

// Get trending scams
export const getTrendingScams = async (days = 7) => {
  try {
    const response = await fetch(`${API_URL}/stats/trending?days=${days}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get trending scams');
    }

    return data;
  } catch (error) {
    console.error('Get trending scams error:', error);
    throw error;
  }
};

// Get report statistics
export const getReportStats = async () => {
  try {
    const response = await fetch(`${API_URL}/stats/reports`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get report stats');
    }

    return data;
  } catch (error) {
    console.error('Get report stats error:', error);
    throw error;
  }
};
