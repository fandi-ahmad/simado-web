import { callApi } from "./utils"

export const GetAllUser = () => {
  return callApi('get', '/user')
}

export const CreateUser = (data) => {
  return callApi('post', '/user/create', data)
}

export const DeleteUser = (uuid) => {
  return callApi('delete', '/user/delete/'+uuid)
}

export const UpdateUser = (data) => {
  return callApi('put', '/user/update', data)
}