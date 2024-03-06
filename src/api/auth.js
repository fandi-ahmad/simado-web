import { callApi } from "./utils"

export const LoginUser = (data) => {
  return callApi('post', '/auth/login', data)
}

// export const LoginUser = (data) => {
//   return axios.post(`${apiUrl}/login`, data)
//   .then(response => response.data)
//   .catch(error => error.response)
// }