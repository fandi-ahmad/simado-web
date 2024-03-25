import { callApi } from "../utils"

export const GetAllStudentFile = (id_study_year, id_class_name, semester, page, limit, order, orderValue, category) => {
  return callApi('get', `/rapor?id_study_year=${id_study_year}&id_class_name=${id_class_name}&semester=${semester}&page=${page}&limit=${limit}&order=${order}&order_value=${orderValue}&category=${category}`)
}

export const CreateStudentFile = (data) => {
  return callApi('post', '/rapor/create', data)
}

export const DeleteStudentFile = (id) => {
  return callApi('delete', '/rapor/delete/'+id)
}

export const UpdateStudentFile = (data) => {
  return callApi('put', '/rapor/update', data)
}