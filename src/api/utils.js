import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL

const headers = () => {
  return {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
}

export const callApi = (method, url, data = null) => {
  return axios[method](apiUrl+url, data, {
    withCredentials: true,
  }, headers())
  .then(response => response.data)
  .catch(error => {
    throw error.response.data
  });
};