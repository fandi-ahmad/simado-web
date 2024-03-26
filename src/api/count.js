import { callApi } from "./utils"

export const GetAllCount = () => {
  return callApi('get', `/count`)
}