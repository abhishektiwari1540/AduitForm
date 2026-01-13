import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || "http://localhost:5000/api/";

export const multipleChoiceService = {
  // Save multiple choice responses for a question
  async saveMultipleChoiceResponses(questionId, responses) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}units/questions/${questionId}/multiple-choice-responses`,
        { responses }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving multiple choice responses:', error);
      throw error;
    }
  },

  // Get multiple choice responses for a question
  async getMultipleChoiceResponses(questionId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}units/questions/${questionId}/multiple-choice-responses`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching multiple choice responses:', error);
      throw error;
    }
  },

  // Get global response sets
  async getGlobalResponseSets() {
    try {
      const response = await axios.get(
        `${API_BASE_URL}global-response-sets`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching global response sets:', error);
      throw error;
    }
  },

  // Save as global response set
  async saveAsGlobalResponseSet(name, responses) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}global-response-sets`,
        { name, responses }
      );
      return response.data;
    } catch (error) {
      console.error('Error saving global response set:', error);
      throw error;
    }
  },

  // Update global response set
  async updateGlobalResponseSet(setId, updates) {
    try {
      const response = await axios.put(
        `${API_BASE_URL}global-response-sets/${setId}`,
        updates
      );
      return response.data;
    } catch (error) {
      console.error('Error updating global response set:', error);
      throw error;
    }
  },

  // Delete global response set
  async deleteGlobalResponseSet(setId) {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}global-response-sets/${setId}`
      );
      return response.data;
    } catch (error) {
      console.error('Error deleting global response set:', error);
      throw error;
    }
  }
};