import { callApi } from "./utils"

export const GetAllFile = (page, limit, order, orderValue, search = '') => {
  return callApi('get', `/file?page=${page}&limit=${limit}&order=${order}&order_value=${orderValue}&search=${search}`)
}

export const GetAllFileByCategory = (id, page, limit, order, orderValue, search = '') => {
  return callApi('get', `/file/category/${id}?page=${page}&limit=${limit}&order=${order}&order_value=${orderValue}&search=${search}`)
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