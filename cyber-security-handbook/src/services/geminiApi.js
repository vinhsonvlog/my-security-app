import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1124'

export const generateCyberQuestion = async (type = null, difficulty = 'cơ bản') => {
  try {
    const response = await axios.post(`${API_URL}/api/quiz/generate`, {
      type,
      difficulty
    })

    if (response.data.success) {
      return response.data.data
    } else {
      console.error('Error from API:', response.data.message)
      return null
    }

  } catch (error) {
    console.error('Error calling backend API:', error)
    return null
  }
}

export const getRandomQuestion = async (type = null, difficulty = null) => {
  try {
    const params = {}
    if (type) params.type = type
    if (difficulty) params.difficulty = difficulty

    const response = await axios.get(`${API_URL}/api/quiz/random`, { params })

    if (response.data.success) {
      return response.data.data
    } else {
      console.error('Error from API:', response.data.message)
      return null
    }

  } catch (error) {
    console.error('Error getting random question:', error)
    return null
  }
}

export const getQuestionTypes = async () => {
  try {
    const response = await axios.get(`${API_URL}/api/quiz/types`)

    if (response.data.success) {
      return response.data.data
    } else {
      console.error('Error from API:', response.data.message)
      return null
    }

  } catch (error) {
    console.error('Error getting question types:', error)
    return null
  }
}
