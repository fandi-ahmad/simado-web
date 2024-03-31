import { callApi, callApiGet } from "./utils"

export const GetAllCount = () => {
  return callApiGet('/count')
}

export const GetPostCount = () => {
  return callApi('post', `/count/post`)
}