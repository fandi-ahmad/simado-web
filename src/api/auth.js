import { callApi, callApiData } from "./utils"

export const LoginUser = (data) => {
  return callApiData('post', '/auth/login', data)
}

export const GetUserLogin = () => {
  return callApi('get', '/auth/get-user')
}

export const LogoutUser = () => {
  return callApiData('post', '/auth/logout')
}