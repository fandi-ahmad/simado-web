import { callApi } from "./utils"

export const GetAllStudyYear = (id = '') => {
  return callApi('get', `/student/study/${id}`)
}

export const CreateStudyYear = (data) => {
  return callApi('post', '/student/study/create', data)
}

export const DeleteStudyYear = (id) => {
  return callApi('delete', '/student/study/delete/'+id)
}

export const UpdateStudyYear = (data) => {
  return callApi('put', '/student/study/update', data)
}