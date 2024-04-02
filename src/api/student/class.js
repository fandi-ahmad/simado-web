import { callApi, callApiData } from "../utils"

export const GetAllClass = (id = '', id_study_year = '') => {
  return callApi('get', `/student/class/${id}?id_study_year=${id_study_year}`)
}

export const CreateClass = (data) => {
  return callApiData('post', '/student/class/create', data)
}

export const DeleteClass = (id) => {
  return callApi('delete', '/student/class/delete/'+id)
}

export const UpdateClass = (data) => {
  return callApiData('put', '/student/class/update', data)
}