import { callApi } from "./utils"

export const GetAllClass = (id = '') => {
  return callApi('get', `/student/class/${id}`)
}

export const CreateClass = (data) => {
  return callApi('post', '/student/class/create', data)
}

export const DeleteClass = (id) => {
  return callApi('delete', '/student/class/delete/'+id)
}

export const UpdateClass = (data) => {
  return callApi('put', '/student/class/update', data)
}