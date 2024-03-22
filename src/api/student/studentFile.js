import { callApi } from "../utils"

export const GetAllStudentFile = (id_study_year, id_class_name, semester, page, limit, order, orderValue) => {
  return callApi('get', `/student/file?id_study_year=${id_study_year}&id_class_name=${id_class_name}&semester=${semester}&page=${page}&limit=${limit}&order=${order}&order_value=${orderValue}`)
}

export const CreateStudentFile = (data) => {
  return callApi('post', '/student/file/create', data)
}

export const DeleteStudentFile = (id) => {
  return callApi('delete', '/student/file/delete/'+id)
}

export const UpdateStudentFile = (data) => {
  return callApi('put', '/student/file/update', data)
}