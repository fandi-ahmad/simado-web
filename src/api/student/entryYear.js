import { callApi, callApiData } from "../utils"

export const GetAllEntryYear = (id = '') => {
  return callApi('get', `/student/entry-year/${id}`)
}

export const CreateEntryYear = (data) => {
  return callApiData('post', '/student/entry-year/create', data)
}

export const DeleteEntryYear = (id) => {
  return callApi('delete', '/student/entry-year/delete/'+id)
}

export const UpdateEntryYear = (data) => {
  return callApiData('put', '/student/entry-year/update', data)
}