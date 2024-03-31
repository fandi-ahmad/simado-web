import { callApi, callApiGet } from "./utils"

export const LoginUser = (data) => {
  return callApi('post', '/auth/login', data)
}

export const GetUserLogin = () => {
  return callApiGet('/auth/get-user')
}