import { callApi, callApiData } from "../utils"

export const GetAllStudyYear = (id = '') => {
  return callApi('get', `/student/study/${id}`)
}

export const CreateStudyYear = (data) => {
  return callApiData('post', '/student/study/create', data)
}

export const DeleteStudyYear = (id) => {
  return callApi('delete', '/student/study/delete/'+id)
}

export const UpdateStudyYear = (data) => {
  return callApiData('put', '/student/study/update', data)
}