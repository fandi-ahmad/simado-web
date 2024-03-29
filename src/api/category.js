import { callApi } from "./utils"

export const GetAllCategory = () => {
  return callApi('get', '/category')
}

export const CreateCategory = (data) => {
  return callApi('post', '/category/create', data)
}

export const DeleteCategory = (uuid) => {
  return callApi('delete', '/category/delete/'+uuid)
}

export const UpdateCategory = (data) => {
  return callApi('put', '/category/update', data)
}