import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL

const headers = () => {
  return {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }
}

export const callApiData = (method, url, data = null) => {
  return axios[method](apiUrl+'/api/v1'+url, data, {
    withCredentials: true,
  }, headers())
  .then(response => response.data)
  .catch(error => {
    return error.response.data
  });
};

export const callApi = async (method, url) => {
  return axios[method](apiUrl+'/api/v1'+url, {
    withCredentials: true,
  }, headers())
  .then(response => response.data)
  .catch(error => {
    return error.response.data
  });
};