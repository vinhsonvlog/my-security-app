const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124/api';

const getToken = () => {
  return localStorage.getItem('token');
};

// Upload images
export const uploadImages = async (files) => {
  try {
    const formData = new FormData();
    
    // Add all files to formData
    for (let i = 0; i < files.length; i++) {
      formData.append('images', files[i]);
    }

    const response = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to upload images');
    }

    return data;
  } catch (error) {
    console.error('Upload images error:', error);
    throw error;
  }
};

// Delete image
export const deleteImage = async (publicId) => {
  try {
    const token = getToken();

    const response = await fetch(`${API_URL}/upload`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ publicId })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to delete image');
    }

    return data;
  } catch (error) {
    console.error('Delete image error:', error);
    throw error;
  }
};
