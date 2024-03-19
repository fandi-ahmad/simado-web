import { callApi } from "../utils"

export const GetAllStudent = (page, limit, order, orderValue, search, entryYear = '') => {
  return callApi('get', `/student?page=${page}&limit=${limit}&order=${order}&order_value=${orderValue}&search=${search}&entry_year=${entryYear}`)
}

export const CreateStudent = (data) => {
  return callApi('post', '/student/create', data)
}

export const DeleteStudent = (id) => {
  return callApi('delete', '/student/delete/'+id)
}

export const UpdateStudent = (data) => {
  return callApi('put', '/student/update', data)
}