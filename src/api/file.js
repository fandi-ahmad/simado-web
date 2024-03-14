import { callApi } from "./utils"

export const GetAllFile = () => {
  return callApi('get', '/file')
}

export const GetAllFileByCategory = (id) => {
  return callApi('get', '/file/category/'+id)
}

export const CreateFile = (data) => {
  return callApi('post', '/file/create', data)
}

export const DeleteFile = (id) => {
  return callApi('delete', '/file/delete/'+id)
}

export const UpdateFile = (data) => {
  return callApi('put', '/file/update', data)
}