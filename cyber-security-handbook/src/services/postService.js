import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124';

// Get token from localStorage
const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Create a new post
 */
export const createPost = async (postData) => {
  try {
    const response = await axios.post(`${API_URL}/api/posts`, postData, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all approved posts (public)
 */
export const getApprovedPosts = async (page = 1, limit = 20) => {
  try {
    const response = await axios.get(`${API_URL}/api/posts`, {
      params: { page, limit }
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching posts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get approved posts for admin (admin only)
 */
export const getApprovedPostsAdmin = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts/all`, {
      params: { status: 'approved' },
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching approved posts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get single post by ID (public)
 */
export const getPostById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/api/posts/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching post:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get current user's posts
 */
export const getMyPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts/my`, {
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching my posts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all pending posts (admin only)
 */
export const getPendingPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts/pending`, {
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching pending posts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get all posts with filters (admin only)
 */
export const getAllPosts = async (status = null, page = 1, limit = 50) => {
  try {
    const params = { page, limit };
    if (status) params.status = status;

    const response = await axios.get(`${API_URL}/api/posts/all`, {
      params,
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching all posts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Get rejected posts (admin only)
 */
export const getRejectedPosts = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/posts/all`, {
      params: { status: 'rejected' },
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching rejected posts:', error);
    throw error.response?.data || error;
  }
};

/**
 * Approve a post (admin only)
 */
export const approvePost = async (postId, adminNote = '') => {
  try {
    const response = await axios.put(
      `${API_URL}/api/posts/${postId}/approve`,
      { adminNote },
      { headers: getAuthHeader() }
    );

    return response.data;
  } catch (error) {
    console.error('Error approving post:', error);
    throw error.response?.data || error;
  }
};

/**
 * Reject a post (admin only)
 */
export const rejectPost = async (postId, adminNote = '') => {
  try {
    const response = await axios.put(
      `${API_URL}/api/posts/${postId}/reject`,
      { adminNote },
      { headers: getAuthHeader() }
    );

    return response.data;
  } catch (error) {
    console.error('Error rejecting post:', error);
    throw error.response?.data || error;
  }
};

/**
 * Delete a post (admin only)
 */
export const deletePost = async (postId) => {
  try {
    const response = await axios.delete(`${API_URL}/api/posts/${postId}`, {
      headers: getAuthHeader()
    });

    return response.data;
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error.response?.data || error;
  }
};
