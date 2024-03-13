import { callApi } from "./utils"

export const GetAllStudent = () => {
  return callApi('get', `/student/`)
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