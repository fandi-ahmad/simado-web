import { callApi } from "./utils"

export const GetAllFile = () => {
  return callApi('get', '/file')
}

export const GetAllFileByCategory = (id, page, limit, order, orderValue) => {
  return callApi('get', `/file/category/${id}?page=${page}&limit=${limit}&order=${order}&order_value=${orderValue}`)
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