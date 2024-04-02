import { callApi, callApiData } from "./utils"

export const GetAllCategory = () => {
  return callApi('get', '/category')
}

export const CreateCategory = (data) => {
  return callApiData('post', '/category/create', data)
}

export const DeleteCategory = (uuid) => {
  return callApi('delete', '/category/delete/'+uuid)
}

export const UpdateCategory = (data) => {
  return callApiData('put', '/category/update', data)
}