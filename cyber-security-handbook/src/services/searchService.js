const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

// Search single URL
export const searchUrl = async (url) => {
  try {
    const response = await fetch(`${API_URL}/search?url=${encodeURIComponent(url)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to search URL');
    }

    return data;
  } catch (error) {
    console.error('Search URL error:', error);
    throw error;
  }
};

// Search multiple URLs
export const bulkSearchUrls = async (urls) => {
  try {
    const response = await fetch(`${API_URL}/search/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to search URLs');
    }

    return data;
  } catch (error) {
    console.error('Bulk search URLs error:', error);
    throw error;
  }
};
