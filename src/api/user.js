import { callApi, callApiData } from "./utils"

export const GetAllUser = () => {
  return callApi('get', '/user')
}

export const CreateUser = (data) => {
  return callApiData('post', '/user/create', data)
}

export const DeleteUser = (uuid) => {
  return callApi('delete', '/user/delete/'+uuid)
}

export const UpdateUser = (data) => {
  return callApiData('put', '/user/update', data)
}