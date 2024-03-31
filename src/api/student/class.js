import { callApi, callApiGet } from "../utils"

export const GetAllClass = (id = '', id_study_year = '') => {
  return callApiGet(`/student/class/${id}?id_study_year=${id_study_year}`)
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