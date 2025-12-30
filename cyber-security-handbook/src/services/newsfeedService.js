const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

// Get recent scams
export const getRecentScams = async (limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/newsfeed?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get recent scams');
    }

    return data;
  } catch (error) {
    console.error('Get recent scams error:', error);
    throw error;
  }
};

// Get scams by type
export const getScamsByType = async (scamType, limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/newsfeed?scamType=${scamType}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get scams by type');
    }

    return data;
  } catch (error) {
    console.error('Get scams by type error:', error);
    throw error;
  }
};

// Get scams by danger level
export const getScamsByDangerLevel = async (dangerLevel, limit = 20) => {
  try {
    const response = await fetch(`${API_URL}/newsfeed?dangerLevel=${dangerLevel}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get scams by danger level');
    }

    return data;
  } catch (error) {
    console.error('Get scams by danger level error:', error);
    throw error;
  }
};

// Get top scams
export const getTopScams = async (limit = 10) => {
  try {
    const response = await fetch(`${API_URL}/newsfeed/top?limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to get top scams');
    }

    return data;
  } catch (error) {
    console.error('Get top scams error:', error);
    throw error;
  }
};
