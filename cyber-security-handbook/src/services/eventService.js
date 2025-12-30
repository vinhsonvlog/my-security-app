import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124'

export const getAllEvents = async () => {
  const response = await axios.get(`${API_URL}/api/events`)
  return response.data
}

export const getEventById = async (id) => {
  const response = await axios.get(`${API_URL}/api/events/${id}`)
  return response.data
}

export const createEvent = async (eventData) => {
  const token = localStorage.getItem('token')
  const response = await axios.post(`${API_URL}/api/events`, eventData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const updateEvent = async (id, eventData) => {
  const token = localStorage.getItem('token')
  const response = await axios.put(`${API_URL}/api/events/${id}`, eventData, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}

export const deleteEvent = async (id) => {
  const token = localStorage.getItem('token')
  const response = await axios.delete(`${API_URL}/api/events/${id}`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  return response.data
}
