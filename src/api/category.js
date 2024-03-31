import { callApi, callApiGet } from "./utils"

export const GetAllCategory = () => {
  return callApiGet('/category')
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